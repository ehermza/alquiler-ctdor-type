import { Request, Response } from "express";
import {ObjectID} from "mongodb"

// import { IRental, RgtPago } from "../models/Rental";
// import {IContainer} from "../models/Container";

import {
    getRentalObjectServ,
    insertPaymentService,
    createAlquilerService
} from "../services/rentalService";

import { getContainerOneServ } from "../services/containerService";

export async function createPaymentCtrl(req: Request, res: Response)
 {
    try {
        // const { container, value, recibo_n } = req.body;   
        const { container } = req.body;   
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
        await insertPaymentService(objRent, req.body);
        res.json(objRent);

    } catch (error) {
        res.status(707).json({ message: 'Error to try GET Rent object.' })
    }

}

export async function print(req:Request, res:Response) {
    try {
        res.json(req.body);
    } catch (error) {
        res.json({message:'is not working, failure!'})
    }
}

export async function createAlquilerCtrl(req:Request,res:Response) 
{
    try {
        // const {idclient, idctner, fecha} = req.body;
        const {ptr_client, ptr_ctner} = req.body;
        // const fecha = Date.now();
        const alquiler= await createAlquilerService(ptr_client, ptr_ctner, Date.now());
        res.json(alquiler);

    } catch (error) {
        res.status(730).json({status:730, message:'Error to try create Alquiler object!'});
    }
}