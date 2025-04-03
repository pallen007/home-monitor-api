import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    const ids = req.query.ids?.toString().split(',').map(Number) || [];
    const sensorData = ids.map((id) => ({
        id,
        moisture: Math.random() * 100,
        temperature: Math.random() * 35,
    }));
    res.json(sensorData);
});

export default router;