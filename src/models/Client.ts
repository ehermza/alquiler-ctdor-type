import { Document, Schema, models, model } from "mongoose";
import { uuid } from "uuidv4";

export interface IClient extends Document {
    name: string;
    telephone: string;
    DNI: string;
    business: string;
    active: boolean;
    deuda_total: Number;
    pagos_total: Number;
    rent_info: Array<any>;

};

const ClientSchema = new Schema(
    {
        name: { type: String, required: true },
        telephone: String,
        DNI: String,
        business: String,
        active: { type: Boolean, default: true },
        deuda_total: { type: Number, default: 0 },
        pagos_total: { type: Number, default: 0 },
        rent_info: [
            {
                inicio: { type: Date, default: Date.now() },
                finish: Date,
                id_container: Number,
            }
        ]    
    }
);

export default model<IClient>('client', ClientSchema);