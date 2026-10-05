const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// پشت Nginx/Docker/CDN: IP واقعی کاربر را از X-Forwarded-For بخوان (برای rate-limit)
// 1 = یک proxy مورد اعتماد. اگر مستقیم و بدون proxy اجرا می‌کنید، TRUST_PROXY=0 بگذارید.
app.set('trust proxy', Number(process.env.TRUST_PROXY ?? 1));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS Configuration - Support multiple origins
// با معماری Vercel Proxy، تمام درخواست‌های Client-Side از همین Origins می‌آیند
// Server-Side requests از Vercel (INTERNAL_API_URL) نیاز به CORS ندارند
const allowedOrigins = [
  'http://localhost:3000',           // Development
  'https://radif-ecu.ir',            // Production
  'https://www.radif-ecu.ir',        // WWW subdomain
  'https://radif-ecu.vercel.app',    // Vercel preview deployments
  process.env.CLIENT_URL             // Custom client URL از .env
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // In development, allow any origin
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against whitelist
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.body   = mongoSanitize.sanitize(req.body);
  req.params = mongoSanitize.sanitize(req.params);
  next();
});

// Serve static files (uploaded images)
app.use('/uploads', express.static('public/uploads'));
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/appointments',  require('./routes/appointmentRoutes'));
app.use('/api/articles',      require('./routes/articleRoutes'));
app.use('/api/contact',       require('./routes/contactRoutes'));
app.use('/api/landing-pages', require('./routes/landingPageRoutes'));
app.use('/api/upload',        require('./routes/uploadRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'online', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'خطای داخلی سرور' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
