require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function changeAdminPassword() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.log('❌ MongoDB URI not found in .env file!');
      console.log('Please set MONGODB_URI or MONGO_URI in .env');
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Import User model
    const User = require('../models/User');

    // Prompt for identifier
    const identifier = await new Promise((resolve) => {
      rl.question('Enter admin identifier (default: speedster): ', (answer) => {
        resolve(answer.trim() || 'speedster');
      });
    });

    // Find user
    const user = await User.findOne({ identifier }).select('+password');
    
    if (!user) {
      console.log('❌ User not found!');
      console.log('Available identifiers: speedster, admin@radif-ecu.ir');
      process.exit(1);
    }

    if (user.role !== 'admin') {
      console.log('⚠️  Warning: This user is not an admin!');
    }

    // Prompt for new password
    const newPassword = await new Promise((resolve) => {
      rl.question('Enter new password (min 8 characters): ', (answer) => {
        resolve(answer.trim());
      });
    });

    if (newPassword.length < 8) {
      console.log('❌ Password must be at least 8 characters long!');
      process.exit(1);
    }

    // Confirm password
    const confirmPassword = await new Promise((resolve) => {
      rl.question('Confirm new password: ', (answer) => {
        resolve(answer.trim());
      });
    });

    if (newPassword !== confirmPassword) {
      console.log('❌ Passwords do not match!');
      process.exit(1);
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log('✅ Password changed successfully!');
    console.log(`Identifier: ${user.identifier}`);
    console.log(`Name: ${user.name}`);
    console.log(`Role: ${user.role}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  }
}

changeAdminPassword();
