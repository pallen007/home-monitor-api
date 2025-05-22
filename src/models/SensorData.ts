// src/models/SensorData.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISensorData extends Document {
    plantId: number;
    userId: string;
    moistureLevel: number;
    temperature: number;
    timestamp: Date;
}

const SensorDataSchema: Schema = new Schema({
    plantId: { type: Number, required: true },
    userId: { type: String, required: true },
    moistureLevel: { type: Number, required: true },
    temperature: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

SensorDataSchema.index({ plantId: 1, timestamp: -1 });

export default mongoose.model<ISensorData>('SensorData', SensorDataSchema);