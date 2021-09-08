import { Request, Response } from "express";
import {ObjectID} from "mongodb"

import Rental, { IRental, RgtPago } from "../models/Rental";
import {IContainer} from "../models/Container";

import {
    getRentalObjectServ,
    insertPaymentService
} from "../services/rentalService";

import { getContainerOneServ } from "../services/containerService";

export async function createPaymentCtrl(req: Request, res: Response) {
    try {
        const { container, value, recibo_n } = req.body;   
        /** const container is 'id_container' property 
         *      from Container class */
        console.log(' createPaymentCtrl (req.body) ', req.body);
        const objCtner= await getContainerOneServ(new ObjectID(container));
        if(!objCtner) {
            res.status(714).json({ message: 'Container object not defined!' });
            return;
        }
        const idclient:string = objCtner.rented_by_id;
        
        const objRent: any = await getRentalObjectServ(idclient, container);
        if(!objRent) {
            res.status(710).json({ message: 'Rental object is null or undefined.' })
            return;
        }

        const pago:RgtPago = {
            value: parseFloat(value),
            period: 'periodo',
            paid_at: new Date(),
            recibo_n: recibo_n
        }
        await insertPaymentService(objRent, pago);
        res.json(objRent);

    } catch (error) {
        res.status(707).json({ message: 'Error to try GET Rent object.' })
    }

}
