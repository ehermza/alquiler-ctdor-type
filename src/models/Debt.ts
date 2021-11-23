import { Schema, model, Document } from 'mongoose';
// import { uuid } from 'uuidv4';

export interface IDebt extends Document {
    number_ctner: string;
    id_rental: string;
    name_client: string;
    current_debt: number;
    price_rental: number;
    overdue_debt: number;
    paid_current_per: string;
}

const DebtSchema = new Schema(
    {
        number_ctner: { type: String, required: true },
        id_rental: { type: String, required: true },
        name_client: { type: String, required: true },
        current_debt: { type: Number, required: true },
        price_rental: { type: Number, required: true },
        overdue_debt: { type: Number, default: 0 },
        paid_current_per: { type: String, default: '0' }
    }
);

export default model('debt', DebtSchema);