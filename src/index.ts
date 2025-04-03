import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import plantsRouter from './routes/plants';
import summaryRouter from './routes/summary';
import sensorRouter from './routes/sensor';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/plants', plantsRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/sensor', sensorRouter);

app.listen(PORT, () => {
    console.log(`API is running on http://localhost:${PORT}`);
});