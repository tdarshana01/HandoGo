require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User.model');

const mongoURI = process.env.MONGO_URI;
const adminFullName = process.env.ADMIN_FULLNAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!mongoURI) {
  console.error('MONGO_URI is not set in environment');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to DB');

    if (!adminFullName || !adminEmail || !adminPassword) {
      console.error('ADMIN_FULLNAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in env');
      process.exit(1);
    }

    let user = await User.findOne({ email: adminEmail });
    if (user) {
      console.log('Admin user already exists:', adminEmail);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(adminPassword, salt);

    user = new User({ fullName: adminFullName, email: adminEmail, password: hashed, role: 'Admin' });
    await user.save();
    console.log('Admin user created:', adminEmail);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

run();
