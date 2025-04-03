import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import plantsRouter from './routes/plants';
import summaryRouter from './routes/summary';
import sensorRouter from './routes/sensor';

const app = express();
const PORT = 5000;

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/home-monitor'; // Replace with your MongoDB URI
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(cors());
app.use(bodyParser.json());

app.use('/api/plants', plantsRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/sensor', sensorRouter);

app.listen(PORT, () => {
    console.log(`API is running on http://localhost:${PORT}`);
});