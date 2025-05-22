import express from 'express';
import SensorData from '../models/SensorData';

const router = express.Router();

router.get('/', async (req, res) => {
    const ids = req.query.ids?.toString().split(',').map(Number) || [];
    try {
        const latestSensorData = await Promise.all(
            ids.map(async (plantId) => {
                const data = await SensorData.findOne({ plantId })
                    .sort({ timestamp: -1 })
                    .limit(1);
                return data || {
                    plantId,
                    moistureLevel: null,
                    temperature: null,
                };
            })
        );
        res.json(latestSensorData);
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        res.status(500).json({ error: 'Failed to fetch sensor data' });
    }
});

// Add new sensor reading
router.post('/', async (req, res) => {
    try {
        const sensorData = new SensorData(req.body);
        await sensorData.save();
        res.status(201).json(sensorData);
    } catch (error) {
        console.error('Error saving sensor data:', error);
        res.status(500).json({ error: 'Failed to save sensor data' });
    }
});

export default router;