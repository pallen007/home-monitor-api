import mongoose, { Schema, Document } from 'mongoose';

export interface IPlant extends Document {
    id: number;
    perenualId?: number;
    nickName?: string;
    userId: string;
    wateringSchedule?: {
        frequency: number;
        lastWatered: Date;
        nextWatering: Date;
    };
    moistureLevel?: number;
    idealMoistureLevel?: number;
    sunlightExposure?: string;
    temperature?: number;
    plantDetails?: {
        common_name: string;
        scientific_name: string[];
        other_name: string[];
        cycle: string;
        watering: string;
        sunlight: string[];
        default_image?: {
            thumbnail: string;
            regular_url: string;
        };
    };
}

const PlantSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    perenualId: { type: Number },
    nickName: { type: String },
    userId: { type: String, required: true },
    wateringSchedule: {
        frequency: { type: Number },
        lastWatered: { type: Date },
        nextWatering: { type: Date }
    },
    moistureLevel: { type: Number },
    idealMoistureLevel: { type: Number },
    sunlightExposure: { type: String },
    temperature: { type: Number },
    plantDetails: {
        common_name: { type: String },
        scientific_name: [{ type: String }],
        other_name: [{ type: String }],
        cycle: { type: String },
        watering: { type: String },
        sunlight: [{ type: String }],
        default_image: {
            thumbnail: { type: String },
            regular_url: { type: String }
        }
    }
}, {
    timestamps: true
});

export default mongoose.model<IPlant>('Plant', PlantSchema);