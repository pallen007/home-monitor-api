import express from 'express';
import Plant from '../models/Plant';
import SensorData from '../models/SensorData';

const router: any = (express as any).Router();

router.get('/', (req: any, res: any) => {
    const userId = req.query.userId?.toString();
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    Plant.find({ userId })
        .then((plants) => {
            const totalPlants = plants.length;
            const plantIds = plants.map((p) => p.id);

            return Promise.all(
                plantIds.map((id) =>
                    SensorData.findOne({ plantId: id }).sort({ timestamp: -1 }).limit(1)
                )
            ).then((sensorData) => ({ plants, totalPlants, sensorData }));
        })
        .then(({ plants, totalPlants, sensorData }) => {
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
        })
        .catch((error) => {
            console.error('Error fetching summary stats:', error);
            res.status(500).json({ error: 'Failed to fetch summary stats' });
        });
});

export default router;