const mongoose = require('mongoose');

// serviceType enum matches the frontend SERVICES ids: 'hardware' | 'remap' | 'network'
const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'نام صاحب خودرو الزامی است'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'شماره تماس الزامی است'],
      trim: true,
    },
    carModel: {
      type: String,
      required: [true, 'مدل خودرو الزامی است'],
      trim: true,
    },
    ecuModel: {
      type: String,
      trim: true,
      default: '',
    },
    serviceType: {
      type: String,
      required: [true, 'نوع خدمت الزامی است'],
      enum: {
        values: ['hardware', 'remap', 'network'],
        message: 'نوع خدمت باید یکی از موارد: hardware، remap یا network باشد',
      },
    },
    date: {
      type: String,
      required: [true, 'تاریخ نوبت الزامی است'],
    },
    timeSlot: {
      type: String,
      required: [true, 'ساعت نوبت الزامی است'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد'],
    },
    trackingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: 'وضعیت نامعتبر است',
      },
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

appointmentSchema.index({ trackingCode: 1 });
appointmentSchema.index({ status: 1, createdAt: -1 });
// Prevent double-booking: unique combination of date + timeSlot
appointmentSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
