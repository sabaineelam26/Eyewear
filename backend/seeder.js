require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const seedAdmin = async () => {
    try {
        // Clear existing admins
        await Admin.deleteMany();

        // Create default admin
        const admin = new Admin({
            name: 'Super Admin',
            email: 'admin@eyewear.com',
            password: 'adminpassword123', // Will be hashed by pre-save hook
            role: 'superadmin'
        });

        await admin.save();
        console.log('Admin user seeded successfully!');
        console.log('Email: admin@eyewear.com');
        console.log('Password: adminpassword123');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
