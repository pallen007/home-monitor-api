import express from 'express';

const router = express.Router();

// Mock data
const plants = [
    { id: 1, name: 'Rose', description: 'A beautiful flower', image: 'rose.jpg' },
    { id: 2, name: 'Tulip', description: 'A spring flower', image: 'tulip.jpg' },
];

router.get('/', (req, res) => {
    const ids = req.query.ids?.toString().split(',').map(Number) || [];
    const filteredPlants = plants.filter((plant) => ids.includes(plant.id));
    res.json(filteredPlants);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updatedPlant = req.body;
    res.json({ message: `Plant with ID ${id} updated`, updatedPlant });
});

export default router;