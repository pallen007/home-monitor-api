import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.query.userId;
    res.json({
        userId,
        totalPlants: 10,
        healthyPlants: 8,
        needsAttention: 2,
    });
});

export default router;