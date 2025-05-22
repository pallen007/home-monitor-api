import express from 'express';
import Plant from '../models/Plant';
import SensorData from '../models/SensorData';

const router = express.Router();

router.get('/', async (req, res) => {
    const userId = req.query.userId?.toString();
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const plants = await Plant.find({ userId });
        const totalPlants = plants.length;

        // Get latest sensor data for all plants
        const plantIds = plants.map(p => p.id);
        const sensorData = await Promise.all(
            plantIds.map(id => 
                SensorData.findOne({ plantId: id })
                    .sort({ timestamp: -1 })
                    .limit(1)
            )
        );

        // Count plants needing attention (low moisture or outside ideal temperature range)
        const needsAttention = plants.filter((plant, index) => {
            const sensor = sensorData[index];
            if (!sensor) return false;

            const moistureNeedsAttention = plant.idealMoistureLevel && 
                sensor.moistureLevel < plant.idealMoistureLevel;

            return moistureNeedsAttention;
        }).length;

        res.json({
            userId,
            totalPlants,
            healthyPlants: totalPlants - needsAttention,
            needsAttention,
        });
    } catch (error) {
        console.error('Error fetching summary stats:', error);
        res.status(500).json({ error: 'Failed to fetch summary stats' });
    }
});

export default router;