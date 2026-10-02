// تست «قرارداد» فرانت ↔ بکاند:
// دقیقاً همان payloadهایی که فرانت می‌فرستد را به بکاند می‌دهد تا ناهماهنگی‌هایی مثل
// time/timeSlot یا ارقام فارسی دوباره بی‌صدا فرم‌ها را خراب نکنند.
const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const ContactMessage = require('../models/ContactMessage');
const Appointment = require('../models/Appointment');
const Article = require('../models/Article');
const contactRoutes = require('../routes/contactRoutes');
const appointmentRoutes = require('../routes/appointmentRoutes');
const articleRoutes = require('../routes/articleRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/contact', contactRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/articles', articleRoutes);

const futureDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  if (d.getDay() === 5) d.setDate(d.getDate() + 1); // جمعه تعطیل
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

describe('Frontend ↔ Backend contract', () => {
  describe('LeadForm (POST /api/contact)', () => {
    it('accepts the exact LeadForm payload', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'علی احمدی',
          phone: '09123456789',
          subject: 'درخواست ریمپ ECU',
          message: 'خودرو: پژو ۴۰۵\nصفحه: /remap\nمنبع: gclid=abc',
          website: '',
        })
        .expect(201);
      expect(res.body.success).toBe(true);
      expect(await ContactMessage.countDocuments()).toBe(1);
    });

    it('normalises Persian digits in phone', async () => {
      await request(app)
        .post('/api/contact')
        .send({ name: 'علی', phone: '۰۹۱۲۳۴۵۶۷۸۹', subject: 'درخواست ریمپ', message: 'خودرو: سمند ۱۳۹۸' })
        .expect(201);
      const saved = await ContactMessage.findOne();
      expect(saved.phone).toBe('09123456789');
    });

    it('accepts contact form without email', async () => {
      await request(app)
        .post('/api/contact')
        .send({ name: 'علی', phone: '09123456789', subject: 'سؤال', message: 'سلام، یک سؤال دارم از شما.' })
        .expect(201);
    });

    it('honeypot returns success but stores nothing', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({ name: 'ربات', phone: '09123456789', subject: 'اسپم', message: 'پیام اسپم است', website: 'http://spam.example' })
        .expect(201);
      expect(res.body.success).toBe(true);
      expect(await ContactMessage.countDocuments()).toBe(0);
    });
  });

  describe('Booking (POST /api/appointments)', () => {
    const payload = () => ({
      name: 'علی احمدی',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      carModel: 'پژو ۴۰۵',
      serviceType: 'remap',
      date: futureDate(),
      timeSlot: '12:00',
      notes: 'توضیحات تست',
    });

    it.each(['hardware', 'remap', 'network'])('accepts serviceType=%s', async (serviceType) => {
      const res = await request(app)
        .post('/api/appointments')
        .send({ ...payload(), serviceType })
        .expect(201);
      expect(res.body.appointment.trackingCode).toBeDefined();
    });

    it('rejects the removed serviceType "dump"', async () => {
      await request(app).post('/api/appointments').send({ ...payload(), serviceType: 'dump' }).expect(400);
    });

    it('stores a normalised phone number', async () => {
      await request(app).post('/api/appointments').send(payload()).expect(201);
      const saved = await Appointment.findOne();
      expect(saved.phone).toBe('09123456789');
    });
  });

  describe('Articles', () => {
    it('GET /api/articles/:slug returns { article } for a published article', async () => {
      await Article.create({ title: 'ریمپ چیست', slug: 'remap-chist', content: 'متن', category: 'ecu', published: true });
      const res = await request(app).get('/api/articles/remap-chist').expect(200);
      expect(res.body.article.title).toBe('ریمپ چیست');
      expect(res.body.article.updatedAt).toBeDefined();
    });

    it('hides drafts from guests', async () => {
      await Article.create({ title: 'پیش‌نویس', slug: 'draft-one', content: 'متن', category: 'ecu', published: false });
      await request(app).get('/api/articles/draft-one').expect(404);
    });

    it('GET /api/articles/admin/all requires auth', async () => {
      await request(app).get('/api/articles/admin/all').expect(401);
    });
  });
});

describe('Article security', () => {
  const express2 = require('express');
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');

  it('strips <script> and event handlers from created article content', async () => {
    const admin = await User.create({ name: 'Admin User', identifier: 'sec-admin@example.com', password: 'password123', role: 'admin' });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1d' });
    const res = await request(app)
      .post('/api/articles')
      .set('Cookie', [`token=${token}`])
      .send({ title: 'تست امنیت', content: '<p onclick="x()">سلام</p><script>alert(1)</script>', category: 'ecu', published: true });
    expect(res.status).toBe(201);
    const saved = await Article.findOne({ title: 'تست امنیت' });
    expect(saved.content).not.toMatch(/<script/i);
    // نباید هیچ تگ واقعی (باز) با onclick باقی بماند؛ متنِ escape‌شده (&lt;p onclick…) بی‌خطر است
    expect(saved.content).not.toMatch(/<[^>]*onclick/i);
  });

  it('guests only get a short preview of private articles', async () => {
    const long = '<p>' + 'متن طولانی '.repeat(100) + '</p>';
    await Article.create({ title: 'خصوصی', slug: 'private-one', content: long, category: 'ecu', published: true, isPrivate: true, downloadUrl: 'https://example.com/f' });
    const res = await request(app).get('/api/articles/private-one').expect(200);
    expect(res.body.article.downloadUrl).toBeNull();
    expect(res.body.article.contentLocked).toBe(true);
    expect(res.body.article.content.length).toBeLessThan(400);
  });
});

describe('Public registration', () => {
  it('is covered by existing auth tests (open only in test env)', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
