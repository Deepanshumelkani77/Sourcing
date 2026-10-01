const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete admin from old User model if exists
    const oldAdmin = await User.findOne({ email: 'admin@indochinabridge.com' });
    if (oldAdmin) {
      console.log('Deleting old admin from User model...');
      await User.deleteOne({ email: 'admin@indochinabridge.com' });
      console.log('Old admin deleted');
    }

    // Force delete admin from Admin model if exists and recreate
    const existingAdmin = await Admin.findOne({ email: 'admin@indochinabridge.com' });
    if (existingAdmin) {
      console.log('Deleting existing admin from Admin model to recreate...');
      await Admin.deleteOne({ email: 'admin@indochinabridge.com' });
      console.log('Existing admin deleted');
    }

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    // Create admin user with pre-hashed password
    const admin = await Admin.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@indochinabridge.com',
      password: hashedPassword,
      department: 'Management',
      phone: '+91 9999122522',
      isActive: true
    });

    console.log('Admin user created successfully');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123');
    console.log('Department:', admin.department);
    console.log('\nPlease change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
