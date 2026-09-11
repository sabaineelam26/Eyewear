const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Admin = require('./models/Admin');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
process.env.JWT_SECRET = 'test_secret';

app.use('/api/products', require('./routes/productRoutes'));

let mongoServer;
let adminToken;
let categoryId;
let productId;

describe('Product API Tests', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        const admin = await Admin.create({
            name: 'Admin',
            email: 'admin@prod.com',
            password: 'pwd',
            role: 'admin'
        });
        adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

        const category = await Category.create({ name: 'Glasses', description: 'desc' });
        categoryId = category._id;
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should create a new product', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Classic Aviator',
                description: 'Classic aviator sunglasses',
                price: 1500,
                category: categoryId,
                brand: 'RayBan',
                frameShape: 'Aviator',
                gender: 'Unisex',
                stock: 10
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.slug).toMatch(/^classic-aviator-\d+$/);
        productId = res.body.data._id;
    });

    it('should retrieve active products and test filters', async () => {
        // Create another product
        await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Round Glasses',
                description: 'Round prescription glasses',
                price: 500,
                category: categoryId,
                brand: 'Gucci',
                frameShape: 'Round',
                frameColor: 'Black',
                gender: 'Women',
                stock: 5,
                isActive: false
            });

        // Get all active
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body.count).toEqual(1); // Only 1 is active

        // Get by shape
        const res2 = await request(app).get('/api/products?shape=Aviator');
        expect(res2.body.count).toEqual(1);

        // Get by search
        const res3 = await request(app).get('/api/products?search=classic');
        expect(res3.body.count).toEqual(1);

        // Get by price range
        const res4 = await request(app).get('/api/products?minPrice=1000&maxPrice=2000');
        expect(res4.body.count).toEqual(1);
    });
});
