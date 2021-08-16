import { model, Schema, Document } from "mongoose";

export interface IPago extends Document {

}

const PagoSchema = new Schema(
    {

    }
);

export default model<IPago>('pago', PagoSchema);