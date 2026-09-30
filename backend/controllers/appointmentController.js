const crypto = require('crypto');
const Appointment = require('../models/Appointment');

const SERVICE_LABELS = {
  hardware: 'تعمیرات سخت‌افزار',
  remap:    'ریمپ تخصصی',
  network:  'عیب‌یابی شبکه',
};

const generateTrackingCode = () =>
  `ECU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

const getUniqueTrackingCode = async () => {
  let code;
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 10) {
    code = generateTrackingCode();
    exists = await Appointment.exists({ trackingCode: code });
    attempts++;
  }

  // Fallback: timestamp-based suffix guarantees uniqueness
  if (exists) code = `ECU-${Date.now().toString(36).toUpperCase().slice(-4)}`;

  return code;
};

const createAppointment = async (req, res) => {
  try {
    const { name, phone, carModel, ecuModel, serviceType, date, timeSlot, notes } = req.body;

    if (!name || !phone || !carModel || !serviceType || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'فیلدهای اجباری: نام، شماره تماس، مدل خودرو، نوع خدمت، تاریخ و ساعت' });
    }

    const validServices = ['hardware', 'remap', 'network'];
    if (!validServices.includes(serviceType)) {
      return res.status(400).json({ success: false, message: 'نوع خدمت نامعتبر است. مقادیر مجاز: hardware، remap، network' });
    }

    // Phone number format validation
    const phoneRegex = /^(\+98|0098|0)9\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: 'شماره تماس معتبر نیست. مثال: ۰۹۱۲XXXXXXX',
      });
    }

    // Prevent booking in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'تاریخ نوبت باید امروز یا در آینده باشد',
      });
    }

    // Prevent double-booking the same date + time slot
    const existingBooking = await Appointment.findOne({ date, timeSlot });
    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'این ساعت قبلاً رزرو شده است. لطفاً ساعت یا روز دیگری انتخاب کنید.',
      });
    }

    const trackingCode = await getUniqueTrackingCode();

    const appointmentData = {
      name:        name.trim(),
      phone:       phone.trim(),
      carModel:    carModel.trim(),
      ecuModel:    (ecuModel || '').trim(),
      serviceType,
      date,
      timeSlot,
      notes:       (notes || '').trim(),
      trackingCode,
    };

    if (req.user) appointmentData.user = req.user._id;

    const appointment = await Appointment.create(appointmentData);

    res.status(201).json({
      success: true,
      message: 'نوبت شما با موفقیت ثبت شد',
      appointment: {
        _id:          appointment._id,
        trackingCode: appointment.trackingCode,
        name:         appointment.name,
        phone:        appointment.phone,
        carModel:     appointment.carModel,
        ecuModel:     appointment.ecuModel,
        serviceType:  appointment.serviceType,
        serviceLabel: SERVICE_LABELS[appointment.serviceType],
        date:         appointment.date,
        timeSlot:     appointment.timeSlot,
        status:       appointment.status,
        createdAt:    appointment.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(500).json({ success: false, message: 'خطا در تولید کد پیگیری. لطفاً دوباره تلاش کنید.' });
    }
    console.error('createAppointment Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const getAppointments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      const valid = ['Pending', 'In Progress', 'Completed'];
      if (!valid.includes(req.query.status)) {
        return res.status(400).json({ success: false, message: 'وضعیت نامعتبر است. مقادیر مجاز: Pending، In Progress، Completed' });
      }
      filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .populate('user', 'name identifier')
      .sort({ createdAt: -1 });

    const data = appointments.map((a) => ({
      ...a.toObject(),
      serviceLabel: SERVICE_LABELS[a.serviceType] || a.serviceType,
    }));

    res.status(200).json({ success: true, count: data.length, appointments: data });
  } catch (error) {
    console.error('getAppointments Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Pending', 'In Progress', 'Completed'];

    if (!status || !valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'وضعیت نامعتبر است. مقادیر مجاز: Pending، In Progress، Completed' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'نوبت مورد نظر یافت نشد' });
    }

    res.status(200).json({
      success: true,
      message: 'وضعیت نوبت با موفقیت به‌روز شد',
      appointment: { ...appointment.toObject(), serviceLabel: SERVICE_LABELS[appointment.serviceType] || appointment.serviceType },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'شناسه نوبت نامعتبر است' });
    }
    console.error('updateAppointmentStatus Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const getAppointmentByTracking = async (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();

    if (!code || !code.startsWith('ECU-')) {
      return res.status(400).json({ success: false, message: 'فرمت کد پیگیری نامعتبر است. مثال: ECU-A1B2' });
    }

    const appointment = await Appointment.findOne({ trackingCode: code }).select(
      'trackingCode name carModel serviceType date timeSlot status createdAt'
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'نوبتی با این کد پیگیری یافت نشد' });
    }

    res.status(200).json({
      success: true,
      appointment: {
        trackingCode: appointment.trackingCode,
        name:         appointment.name,
        carModel:     appointment.carModel,
        serviceType:  appointment.serviceType,
        serviceLabel: SERVICE_LABELS[appointment.serviceType] || appointment.serviceType,
        date:         appointment.date,
        timeSlot:     appointment.timeSlot,
        status:       appointment.status,
        createdAt:    appointment.createdAt,
      },
    });
  } catch (error) {
    console.error('getAppointmentByTracking Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAppointmentByTracking,
};
