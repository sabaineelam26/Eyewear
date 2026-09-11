const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Category = require('./models/Category');
const Admin = require('./models/Admin');
const jwt = require('jsonwebtoken');

// App setup
const app = express();
app.use(express.json());
// Mock JWT Secret
process.env.JWT_SECRET = 'test_secret';

// Routes
app.use('/api/categories', require('./routes/categoryRoutes'));

let mongoServer;
let adminToken;
let createdCategoryId;

describe('Category API Tests', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        // Create Admin user and get token
        const admin = await Admin.create({
            name: 'Test Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin'
        });
        
        adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should create a new category (Admin)', async () => {
        const res = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Sunglasses',
                description: 'Cool sunglasses',
                isActive: true
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.name).toEqual('Sunglasses');
        expect(res.body.data.slug).toEqual('sunglasses');
        createdCategoryId = res.body.data._id;
    });

    it('should not allow duplicate category name', async () => {
        const res = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Sunglasses',
                description: 'Another sunglasses description',
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBeFalsy();
    });

    it('should not allow unauthenticated user to create category', async () => {
        const res = await request(app)
            .post('/api/categories')
            .send({
                name: 'Reading Glasses',
                description: 'For reading',
            });
        
        expect(res.statusCode).toEqual(401);
    });

    it('should get all active categories', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.length).toEqual(1);
        expect(res.body.data[0].name).toEqual('Sunglasses');
    });

    it('should get category by id', async () => {
        const res = await request(app).get(`/api/categories/${createdCategoryId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.name).toEqual('Sunglasses');
    });

    it('should update category (Admin)', async () => {
        const res = await request(app)
            .put(`/api/categories/${createdCategoryId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Cool Sunglasses',
                description: 'Updated description'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.name).toEqual('Cool Sunglasses');
        // Checking if slug updated
        expect(res.body.data.slug).toEqual('cool-sunglasses');
    });

    it('should not show inactive category in public get', async () => {
        // Set to inactive
        await request(app)
            .put(`/api/categories/${createdCategoryId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                isActive: false
            });

        // Try fetching all
        const res1 = await request(app).get('/api/categories');
        expect(res1.body.data.length).toEqual(0);

        // Try fetching by ID
        const res2 = await request(app).get(`/api/categories/${createdCategoryId}`);
        expect(res2.statusCode).toEqual(403);
    });

    it('should delete category (Admin)', async () => {
        const res = await request(app)
            .delete(`/api/categories/${createdCategoryId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();

        // Verify it's gone
        const check = await Category.findById(createdCategoryId);
        expect(check).toBeNull();
    });
});
