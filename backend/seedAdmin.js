const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if main admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@indochinabridge.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists, updating role to main_admin...');
      existingAdmin.role = 'main_admin';
      existingAdmin.department = 'Management';
      existingAdmin.permissions = ['all'];
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('✅ Admin updated successfully:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log(`   Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    // Create main admin
    const mainAdmin = await Admin.create({
      firstName: 'Main',
      lastName: 'Admin',
      email: 'admin@indochinabridge.com',
      password: hashedPassword,
      phone: '+91 98765 43210',
      role: 'main_admin',
      department: 'Management',
      permissions: ['all'],
      isActive: true
    });

    console.log('✅ Main admin created successfully:');
    console.log(`   Email: ${mainAdmin.email}`);
    console.log(`   Password: Admin@123`);
    console.log(`   Name: ${mainAdmin.firstName} ${mainAdmin.lastName}`);
    console.log(`   Role: ${mainAdmin.role}`);
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
