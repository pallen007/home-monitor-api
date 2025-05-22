import express from 'express';
import Plant, { IPlant } from '../models/Plant';

const router = express.Router();

// TODO: review Copilot edits for this file and make sure they are correct before applying
// Get plants by IDs
router.get('/collection/:userId', async (req, res) => {
    // refactor this to use the userId from the request params and filter all plants belonging to that user
    const ids = req.query.ids?.toString().split(',').map(Number) || [];
    try {
        const plants = await Plant.find({ id: { $in: ids } });
        res.json(plants);
    } catch (error) {
        console.error('Error fetching plants:', error);
        res.status(500).json({ error: 'Failed to fetch plants' });
    }
});

// Get details for a single plant by ID
router.get('/:userId/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.params.userId, 10);
    try {
        const plant = await Plant.findOne({ id });
        if (!plant) {
            return res.status(404).json({ error: 'Plant not found' });
        }
        res.json(plant);
    } catch (error) {
        console.error('Error fetching plant:', error);
        res.status(500).json({ error: 'Failed to fetch plant' });
    }
})

// Add or update a plant
router.put('/:userId/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.params.userId, 10);
    const plantDetails: IPlant = req.body;

    try {
        const updatedPlant = await Plant.findOneAndUpdate({ id }, plantDetails, {
            new: true,
            upsert: true, // Create the document if it doesn't exist
        });
        res.json(updatedPlant);
    } catch (error) {
        console.error('Error updating plant:', error);
        res.status(500).json({ error: 'Failed to update plant' });
    }
});

export default router;