
import { Schema, Document, model } from "mongoose"
import { ObjectID } from 'mongodb'

export interface RgtDeuda {
    value: number;
    period: String;
}

export interface RgtPago {
    // _id: ObjectID;
    value: number;
    period: String;
    paid_at: Date;
    recibo_n: String;
}
export interface LastPayment {
    a_cta: number;
    period: string;
}

/**
 * Class created by EHER Date: Sept.06th, 2021
 *  rent.containers-ng project. ver beta.
 */

 export interface IRental extends Document {
    id_client: String;
    id_container: String;
    id_debtinfo: String;

    active: Boolean;
    date_init: Date;
    date_final?: Date;

    deuda_total: number;
    deuda_register: Array<RgtDeuda>;

    pagos_total: number;
    pagos_register: Array<RgtPago>;
    last_payment: LastPayment; 
    last_deuda_per: string;
 }
 
const rentalSchema = new Schema(
    {
        id_client: {type:String, required:true},
        id_container: {type:String, required:true},
        id_debtinfo: String,

        active: Boolean,
        date_init: {
            type:Date, 
            default: Date.now,
            required: true
        },
        date_final: Date,

        deuda_total: Number,
        deuda_register: [{
            value: Number,
            period: String
        }],
        pagos_total: Number,
        pagos_register: [{
            value: Number,
            period: String,
            paid_at: Date,
            recibo_n: String
        }],
        last_payment: {
            period: String,
            a_cta: Number
        },
        last_deuda_per: String
   }
)

export default model<IRental>('rental', rentalSchema);