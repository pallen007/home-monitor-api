import express from 'express';
import Plant, { IPlant } from '../models/Plant';

const router: any = (express as any).Router();

const parsePlantId = (value: string | undefined) => {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

router.get('/collection', (req: any, res: any) => {
    const userId = req.query.userId?.toString();
    const ids = req.query.ids?.toString().split(',').map((id: string) => Number(id)).filter((id: number) => !Number.isNaN(id)) || [];

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    const query = ids.length ? { userId, id: { $in: ids } } : { userId };

    Plant.find(query)
        .sort({ updatedAt: -1 })
        .then((plants) => res.json(plants))
        .catch((error) => {
            console.error('Error fetching plants:', error);
            res.status(500).json({ error: 'Failed to fetch plants' });
        });
});

router.get('/collection/:userId', (req: any, res: any) => {
    const { userId } = req.params;
    const ids = req.query.ids?.toString().split(',').map((id: string) => Number(id)).filter((id: number) => !Number.isNaN(id)) || [];

    const query = ids.length ? { userId, id: { $in: ids } } : { userId };

    Plant.find(query)
        .sort({ updatedAt: -1 })
        .then((plants) => res.json(plants))
        .catch((error) => {
            console.error('Error fetching plants:', error);
            res.status(500).json({ error: 'Failed to fetch plants' });
        });
});

router.get('/:userId/:id', (req: any, res: any) => {
    const id = parsePlantId(req.params.id);
    const { userId } = req.params;

    if (id === null) {
        return res.status(400).json({ error: 'Plant id is invalid' });
    }

    Plant.findOne({ userId, id })
        .then((plant) => {
            if (!plant) {
                return res.status(404).json({ error: 'Plant not found' });
            }
            res.json(plant);
        })
        .catch((error) => {
            console.error('Error fetching plant:', error);
            res.status(500).json({ error: 'Failed to fetch plant' });
        });
});

router.post('/', (req: any, res: any) => {
    const plantDetails: IPlant = req.body;

    if (!plantDetails.userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    if (plantDetails.id === undefined || plantDetails.id === null) {
        return res.status(400).json({ error: 'Plant id is required' });
    }

    Plant.create(plantDetails)
        .then((createdPlant) => res.status(201).json(createdPlant))
        .catch((error) => {
            console.error('Error creating plant:', error);
            res.status(500).json({ error: 'Failed to create plant' });
        });
});

router.put('/:userId/:id', (req: any, res: any) => {
    const id = parsePlantId(req.params.id);
    const { userId } = req.params;
    const plantDetails: IPlant = req.body;

    if (id === null) {
        return res.status(400).json({ error: 'Plant id is invalid' });
    }

    Plant.findOneAndUpdate({ userId, id }, {
        ...plantDetails,
        userId,
        id,
    }, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
    })
        .then((updatedPlant) => res.json(updatedPlant))
        .catch((error) => {
            console.error('Error updating plant:', error);
            res.status(500).json({ error: 'Failed to update plant' });
        });
});

router.delete('/:userId/:id', (req: any, res: any) => {
    const id = parsePlantId(req.params.id);
    const { userId } = req.params;

    if (id === null) {
        return res.status(400).json({ error: 'Plant id is invalid' });
    }

    Plant.findOneAndDelete({ userId, id })
        .then((deletedPlant) => {
            if (!deletedPlant) {
                return res.status(404).json({ error: 'Plant not found' });
            }

            res.json({ deleted: true, plantId: id, userId });
        })
        .catch((error) => {
            console.error('Error deleting plant:', error);
            res.status(500).json({ error: 'Failed to delete plant' });
        });
});

export default router;