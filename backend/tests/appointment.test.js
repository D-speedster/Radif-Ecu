const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const appointmentRoutes = require('../routes/appointmentRoutes');

// Setup test app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/appointments', appointmentRoutes);

// Helper function to create a test user and get auth token
const createUserAndToken = async (isAdmin = false) => {
  const user = await User.create({
    name: 'Test User',
    identifier: 'test@example.com',
    password: 'password123',
    role: isAdmin ? 'admin' : 'user'
  });
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '30d' });
  return { user, token };
};

describe('Appointment Routes', () => {
  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({});
    await Appointment.deleteMany({});
  });

  describe('POST /api/appointments', () => {
    const validAppointmentData = {
      name: 'علی احمدی',
      phone: '09123456789',
      carModel: 'پژو 206',
      ecuModel: 'Bosch ME7',
      serviceType: 'hardware',
      date: '2026-12-31', // Future date
      timeSlot: '10:00',
      notes: 'مشکل در روشن شدن'
    };

    it('should create appointment successfully', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send(validAppointmentData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('نوبت شما با موفقیت ثبت شد');
      expect(res.body.appointment).toBeDefined();
      expect(res.body.appointment.trackingCode).toMatch(/^ECU-[A-F0-9]{8}$/);
      expect(res.body.appointment.name).toBe(validAppointmentData.name);
      expect(res.body.appointment.serviceLabel).toBe('تعمیرات سخت‌افزار');
    });

    it('should prevent double booking (same date + timeSlot)', async () => {
      // Create first appointment
      await Appointment.create({
        ...validAppointmentData,
        trackingCode: 'ECU-12345678'
      });

      // Try to create second appointment with same date and time
      const res = await request(app)
        .post('/api/appointments')
        .send(validAppointmentData)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('این ساعت قبلاً رزرو شده است. لطفاً ساعت یا روز دیگری انتخاب کنید.');
    });

    it('should return 400 for invalid phone number', async () => {
      const invalidData = {
        ...validAppointmentData,
        phone: '123456' // Invalid format
      };

      const res = await request(app)
        .post('/api/appointments')
        .send(invalidData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('شماره تماس معتبر نیست. مثال: ۰۹۱۲XXXXXXX');
    });

    it('should return 400 for past date', async () => {
      const pastDateData = {
        ...validAppointmentData,
        date: '2020-01-01' // Past date
      };

      const res = await request(app)
        .post('/api/appointments')
        .send(pastDateData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('تاریخ نوبت باید امروز یا در آینده باشد');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        name: 'علی احمدی'
        // Missing required fields
      };

      const res = await request(app)
        .post('/api/appointments')
        .send(incompleteData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('فیلدهای اجباری: نام، شماره تماس، مدل خودرو، نوع خدمت، تاریخ و ساعت');
    });

    it('should return 400 for invalid service type', async () => {
      const invalidServiceData = {
        ...validAppointmentData,
        serviceType: 'invalid-service'
      };

      const res = await request(app)
        .post('/api/appointments')
        .send(invalidServiceData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('نوع خدمت نامعتبر است. مقادیر مجاز: hardware، remap، network');
    });
  });

  describe('GET /api/appointments', () => {
    it('should return 401 without admin token', async () => {
      const res = await request(app)
        .get('/api/appointments')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('دسترسی مجاز نیست. توکن یافت نشد.');
    });

    it('should return appointments for admin user', async () => {
      const { token } = await createUserAndToken(true); // Admin user
      
      // Create test appointment
      await Appointment.create({
        name: 'علی احمدی',
        phone: '09123456789',
        carModel: 'پژو 206',
        serviceType: 'hardware',
        date: '2026-12-31',
        timeSlot: '10:00',
        trackingCode: 'ECU-12345678'
      });

      const res = await request(app)
        .get('/api/appointments')
        .set('Cookie', [`token=${token}`])
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.appointments).toHaveLength(1);
      expect(res.body.appointments[0].serviceLabel).toBe('تعمیرات سخت‌افزار');
    });
  });

  describe('GET /api/appointments/track/:code', () => {
    it('should return appointment by tracking code', async () => {
      const trackingCode = 'ECU-12345678';
      await Appointment.create({
        name: 'علی احمدی',
        phone: '09123456789',
        carModel: 'پژو 206',
        serviceType: 'hardware',
        date: '2026-12-31',
        timeSlot: '10:00',
        trackingCode
      });

      const res = await request(app)
        .get(`/api/appointments/track/${trackingCode}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.appointment.trackingCode).toBe(trackingCode);
      expect(res.body.appointment.serviceLabel).toBe('تعمیرات سخت‌افزار');
    });

    it('should return 404 for non-existent tracking code', async () => {
      const res = await request(app)
        .get('/api/appointments/track/ECU-NOTFOUND')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('نوبتی با این کد پیگیری یافت نشد');
    });

    it('should return 400 for invalid tracking code format', async () => {
      const res = await request(app)
        .get('/api/appointments/track/INVALID-CODE')
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('فرمت کد پیگیری نامعتبر است. مثال: ECU-A1B2');
    });
  });
});