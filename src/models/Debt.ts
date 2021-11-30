import { Schema, model, Document } from 'mongoose';
// import { uuid } from 'uuidv4';

export interface IDebt extends Document {
    number_ctner: number;
    name_client: string;
    current_debt: number;
    price_rental: number;
    overdue_debt: number;
    paid_current_per: string;
}

const DebtSchema = new Schema(
    {
        number_ctner: { type: Number, required: true },
        name_client: String,
        current_debt: { type: Number, required: true },
        price_rental: { type: Number, required: true },
        overdue_debt: { type: Number, default: 0 },
        paid_current_per: { type: String, default: 'not per.' }
    }
);

export default model<IDebt>('debt', DebtSchema);