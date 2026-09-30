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

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL || 'http://localhost'
    : true, // در محیط development هر originی را می‌پذیرد
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.body   = mongoSanitize.sanitize(req.body);
  req.params = mongoSanitize.sanitize(req.params);
  next();
});
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/articles',     require('./routes/articleRoutes'));
app.use('/api/contact',      require('./routes/contactRoutes'));

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
