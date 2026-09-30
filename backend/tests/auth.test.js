const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const User = require('../models/User');
const authRoutes = require('../routes/authRoutes');

// Setup test app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(async () => {
    // Clean up users before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    const validUserData = {
      name: 'علی احمدی',
      identifier: 'ali@example.com',
      password: 'password123'
    };

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.name).toBe(validUserData.name);
      expect(res.body.user.identifier).toBe(validUserData.identifier);
      expect(res.body.user.role).toBe('user');
      expect(res.body.user.password).toBeUndefined();
      
      // Should set httpOnly cookie
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('token=');
      expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
    });

    it('should return 409 for duplicate identifier', async () => {
      // Create first user
      await User.create(validUserData);

      // Try to create duplicate
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('این شماره موبایل یا ایمیل قبلاً ثبت شده است');
    });

    it('should return 400 for password shorter than 8 characters', async () => {
      const invalidUserData = {
        ...validUserData,
        password: '123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUserData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('رمز عبور باید حداقل ۸ کاراکتر باشد');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        name: 'علی احمدی'
        // missing identifier and password
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(incompleteData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('لطفاً تمام فیلدهای اجباری را تکمیل کنید (نام، شناسه، رمز عبور)');
    });
  });

  describe('POST /api/auth/login', () => {
    const userData = {
      name: 'علی احمدی',
      identifier: 'ali@example.com',
      password: 'password123'
    };

    beforeEach(async () => {
      // Create a user for login tests
      await User.create(userData);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: userData.identifier,
          password: userData.password
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.identifier).toBe(userData.identifier);
      
      // Should set httpOnly cookie
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('token=');
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: userData.identifier,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('اطلاعات ورود نادرست است');
    });

    it('should return 401 for non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('اطلاعات ورود نادرست است');
    });

    it('should return 400 for missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: userData.identifier
          // missing password
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('لطفاً شناسه و رمز عبور را وارد کنید');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without token cookie', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('دسترسی مجاز نیست. توکن یافت نشد.');
    });
  });
});