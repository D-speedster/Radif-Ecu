const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ContactMessage = require('../models/ContactMessage');
const contactRoutes = require('../routes/contactRoutes');

// Setup test app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/contact', contactRoutes);

// Helper function to create a test admin user and get auth token
const createAdminAndToken = async () => {
  const user = await User.create({
    name: 'Admin User',
    identifier: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '30d' });
  return { user, token };
};

describe('Contact Routes', () => {
  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({});
    await ContactMessage.deleteMany({});
  });

  describe('POST /api/contact', () => {
    const validContactData = {
      name: 'علی احمدی',
      phone: '09123456789',
      subject: 'مشکل در سیستم ECU',
      message: 'سلام، مشکلی در سیستم ECU خودروی من پیش آمده و نیاز به راهنمایی دارم.'
    };

    it('should create contact message successfully', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send(validContactData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('پیام شما با موفقیت دریافت شد. تیم فنی به زودی پاسخ می‌دهد.');
      expect(res.body.messageId).toBeDefined();

      // Verify message was saved to database
      const savedMessage = await ContactMessage.findById(res.body.messageId);
      expect(savedMessage).toBeTruthy();
      expect(savedMessage.name).toBe(validContactData.name);
      expect(savedMessage.status).toBe('New');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        name: 'علی احمدی'
        // Missing required fields
      };

      const res = await request(app)
        .post('/api/contact')
        .send(incompleteData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('لطفاً تمام فیلدهای اجباری را تکمیل کنید');
    });

    it('should return 400 for invalid phone number', async () => {
      const invalidData = {
        ...validContactData,
        phone: '123456' // Invalid format
      };

      const res = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('شماره موبایل معتبر نیست (مثال: ۰۹۱۲XXXXXXX)');
    });

    it('should return 400 for short name', async () => {
      const invalidData = {
        ...validContactData,
        name: 'ا' // Too short
      };

      const res = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('نام باید حداقل ۲ کاراکتر باشد');
    });

    it('should return 400 for short message', async () => {
      const invalidData = {
        ...validContactData,
        message: 'کوتاه' // Too short
      };

      const res = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('پیام باید حداقل ۱۰ کاراکتر باشد');
    });
  });

  describe('GET /api/contact', () => {
    it('should return 401 without admin token', async () => {
      const res = await request(app)
        .get('/api/contact')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('دسترسی مجاز نیست. توکن یافت نشد.');
    });

    it('should return contact messages for admin user', async () => {
      const { token } = await createAdminAndToken();
      
      // Create test message
      await ContactMessage.create({
        name: 'علی احمدی',
        phone: '09123456789',
        subject: 'مشکل ECU',
        message: 'پیام تست برای بررسی عملکرد سیستم'
      });

      const res = await request(app)
        .get('/api/contact')
        .set('Cookie', [`token=${token}`])
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.messages).toHaveLength(1);
      expect(res.body.messages[0].name).toBe('علی احمدی');
      expect(res.body.messages[0].status).toBe('New');
    });

    it('should filter messages by status', async () => {
      const { token } = await createAdminAndToken();
      
      // Create messages with different statuses
      await ContactMessage.create({
        name: 'پیام جدید',
        phone: '09123456789',
        subject: 'موضوع ۱',
        message: 'پیام با وضعیت New',
        status: 'New'
      });
      
      await ContactMessage.create({
        name: 'پیام خوانده شده',
        phone: '09123456789',
        subject: 'موضوع ۲',
        message: 'پیام با وضعیت Read',
        status: 'Read'
      });

      const res = await request(app)
        .get('/api/contact?status=New')
        .set('Cookie', [`token=${token}`])
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.messages[0].status).toBe('New');
    });
  });

  describe('PATCH /api/contact/:id/status', () => {
    it('should update message status successfully', async () => {
      const { token } = await createAdminAndToken();
      
      const message = await ContactMessage.create({
        name: 'علی احمدی',
        phone: '09123456789',
        subject: 'مشکل ECU',
        message: 'پیام تست',
        status: 'New'
      });

      const res = await request(app)
        .patch(`/api/contact/${message._id}/status`)
        .set('Cookie', [`token=${token}`])
        .send({ status: 'Read' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('وضعیت پیام با موفقیت به‌روز شد');
      expect(res.body.contactMessage.status).toBe('Read');
    });

    it('should return 400 for invalid status', async () => {
      const { token } = await createAdminAndToken();
      
      const message = await ContactMessage.create({
        name: 'علی احمدی',
        phone: '09123456789',
        subject: 'مشکل ECU',
        message: 'پیام تست'
      });

      const res = await request(app)
        .patch(`/api/contact/${message._id}/status`)
        .set('Cookie', [`token=${token}`])
        .send({ status: 'InvalidStatus' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('وضعیت نامعتبر است. مقادیر مجاز: New، Read، Replied');
    });

    it('should return 404 for non-existent message', async () => {
      const { token } = await createAdminAndToken();
      
      const nonExistentId = '507f1f77bcf86cd799439011';

      const res = await request(app)
        .patch(`/api/contact/${nonExistentId}/status`)
        .set('Cookie', [`token=${token}`])
        .send({ status: 'Read' })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('پیام مورد نظر یافت نشد');
    });
  });
});