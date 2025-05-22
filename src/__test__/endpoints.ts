
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index';
import Plant from '../models/Plant';
import SensorData from '../models/SensorData';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Plant.deleteMany({});
    await SensorData.deleteMany({});
});

describe('Plant API', () => {
    const testPlant = {
        id: 1,
        perenualId: 12345,
        nickName: 'Test Plant',
        userId: 'user123',
        plantDetails: {
            common_name: 'Test Common Name',
            scientific_name: ['Test Scientific Name'],
            cycle: 'perennial',
            watering: 'average'
        }
    };

    test('PUT /api/plants/:id should create or update a plant', async () => {
        const response = await request(app)
            .put('/api/plants/1')
            .send(testPlant);
        
        expect(response.status).toBe(200);
        expect(response.body.nickName).toBe(testPlant.nickName);
    });

    test('GET /api/plants/collection/:userId should return user plants', async () => {
        await Plant.create(testPlant);

        const response = await request(app)
            .get('/api/plants/collection/user123');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].nickName).toBe(testPlant.nickName);
    });
});

describe('Sensor API', () => {
    const testSensorData = {
        plantId: 1,
        userId: 'user123',
        moistureLevel: 75,
        temperature: 22
    };

    test('POST /api/sensor should create new sensor reading', async () => {
        const response = await request(app)
            .post('/api/sensor')
            .send(testSensorData);
        
        expect(response.status).toBe(201);
        expect(response.body.moistureLevel).toBe(testSensorData.moistureLevel);
    });

    test('GET /api/sensor should return latest readings', async () => {
        await SensorData.create(testSensorData);

        const response = await request(app)
            .get('/api/sensor?ids=1');
        
        expect(response.status).toBe(200);
        expect(response.body[0].moistureLevel).toBe(testSensorData.moistureLevel);
    });
});

describe('Summary API', () => {
    const testPlant = {
        id: 1,
        userId: 'user123',
        idealMoistureLevel: 80
    };

    const testSensorData = {
        plantId: 1,
        userId: 'user123',
        moistureLevel: 60,
        temperature: 22
    };

    test('GET /api/summary should return correct stats', async () => {
        await Plant.create(testPlant);
        await SensorData.create(testSensorData);

        const response = await request(app)
            .get('/api/summary?userId=user123');
        
        expect(response.status).toBe(200);
        expect(response.body.totalPlants).toBe(1);
        expect(response.body.needsAttention).toBe(1); // Because moisture is below ideal
    });
});