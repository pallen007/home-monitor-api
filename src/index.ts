import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import plantsRouter from './routes/plants';
import summaryRouter from './routes/summary';
import sensorRouter from './routes/sensor';
import perenualRouter from './routes/perenual';

export const app = express();
const PORT = Number(process.env.PORT) || 5000;

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/home-monitor';

if (require.main === module) {
    mongoose
        .connect(MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`API is running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            process.exitCode = 1;
        });
}

app.use(cors());
app.use(bodyParser.json());

app.get('/api/health', (_req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    res.status(databaseReady ? 200 : 503).json({ status: databaseReady ? 'ok' : 'database unavailable' });
});

app.use('/api/plants', plantsRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/sensor', sensorRouter);
app.use('/api/perenual', perenualRouter);

export default app;