import { Schema, model, Document } from 'mongoose';
import { uuid } from 'uuidv4';

export interface IContainer extends Document {
    id_container: string;
    description: string;
    price_tocharge: number;
    rented_by: string;
    rented_by_id: string;
    active: boolean

}

const ContainerSchema = new Schema(
    {
        id_container: { type: Number, required: true },
        description: { type: String, default: "" },
        price_tocharge: Number,
        rented_by: String,
        rented_by_id: {type:String, default: uuid()},
        active: {type:Boolean, default:false}
    }
);

export default model<IContainer>('container', ContainerSchema);

