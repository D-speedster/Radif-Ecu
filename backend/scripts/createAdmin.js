/**
 * Create Admin User Script
 * Usage: node scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_CREDENTIALS = {
  name: 'مدیر سیستم',
  identifier: 'admin@radif.local',
  phone: '09123456789',
  password: 'Admin@1234',  // Change this password immediately after first login!
  role: 'admin',
};

async function createAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ identifier: ADMIN_CREDENTIALS.identifier });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Identifier: ${existingAdmin.identifier}`);
      console.log(`   Role: ${existingAdmin.role}`);
      
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated user role to admin');
      }
      
      process.exit(0);
    }

    // Create new admin
    const admin = await User.create(ADMIN_CREDENTIALS);

    console.log('\n✅ Admin user created successfully!\n');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│   Admin Credentials                     │');
    console.log('├─────────────────────────────────────────┤');
    console.log(`│ Identifier: ${ADMIN_CREDENTIALS.identifier.padEnd(24)} │`);
    console.log(`│ Password:   ${ADMIN_CREDENTIALS.password.padEnd(24)} │`);
    console.log(`│ Role:       ${admin.role.padEnd(24)} │`);
    console.log('└─────────────────────────────────────────┘\n');
    console.log('⚠️  IMPORTANT: Change the admin password immediately after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();
