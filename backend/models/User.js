const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام الزامی است'],
      trim: true,
      minlength: [2, 'نام باید حداقل ۲ کاراکتر باشد'],
      maxlength: [60, 'نام نمی‌تواند بیش از ۶۰ کاراکتر باشد'],
    },
    identifier: {
      type: String,
      required: [true, 'شماره موبایل یا ایمیل الزامی است'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'رمز عبور الزامی است'],
      minlength: [8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// Hash password only when modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
