import mongoose, { Schema, Document } from 'mongoose';

export interface IPlant extends Document {
    id: number;
    name: string;
    description: string;
    image: string;
    userId: string; // To associate plants with a user
}

const PlantSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    userId: { type: String, required: true },
});

export default mongoose.model<IPlant>('Plant', PlantSchema);