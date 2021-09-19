import { Request, Response } from "express";
import { ObjectID } from "mongodb"

import {
    getRentalObjectServ,
    insertPaymentService,
    createAlquilerService,
    getPaymentByCtnerServ,
    getSaldoByCtnerService,
    deletePaymentByCtnerServ
} from "../services/rentalService";

import { getContainerOneServ } from "../services/containerService";
import { RgtPago } from "../models/Rental";
import { Number } from "mongoose";

export async function getPaymentByCtnerCtrl(req: Request, res: Response) {
    /**
     *  First find the Rental active from: (req.params).id_container
     *  .. then return pagos_register
     */
    try {
        const { id } = req.params;
        const pagos: Array<RgtPago> | null = await getPaymentByCtnerServ(id);
        if (!pagos) {
            res.status(580).json({ message: 'Container is not active or not exist:' })
        }
        res.json(pagos);

    } catch (error) {
        res.status(506).json({ status: 506, message: 'Error to try get pagos from database' });

    }
}

export async function deletePaymentCtrl(req: Request, res: Response) {
    try {
        // const { idpayment, idctner } = req.params;
        const { recibo, idctner } = req.params;
        console.log(req.body)
        const result = await deletePaymentByCtnerServ(recibo, idctner);
        if (!result) {
            res.status(536).json({ message: 'Fail to try delete payment.' });
        }
        res.json(result);

    } catch (error) {

    }
}

export async function getSaldoByCtnerCtrl(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result: number = await getSaldoByCtnerService(id);
        res.json({ saldo: result });

    } catch (error) {
        res.status(516).json({ message: 'Error to try get (saldo actual) of client.' })
    }
}
export async function getPagosCtrl(req: Request, res: Response) {
    /*   
          try {
            const pagos = await getPagosService();
            res.json(pagos);
    
        } catch (error) {
            res.status(506).json({ status: 506, message: 'Error to try get pagos from database' });
        }
    */
}

export async function createPaymentCtrl(req: Request, res: Response) {
    try {
        // const { container, value, recibo_n } = req.body;   
        const { container } = req.body;
        /** const container is 'id_container' property 
         *      from Container class */
        console.log(' createPaymentCtrl (req.body) ', req.body);
        const objCtner = await getContainerOneServ(new ObjectID(container));
        if (!objCtner) {
            res.status(714).json({ message: 'Container object not defined!' });
            return;
        }
        const idclient: string = objCtner.rented_by_id;

        const objRent: any = await getRentalObjectServ(idclient, container);
        if (!objRent) {
            res.status(710).json({ message: 'Rental object is null or undefined.' })
            return;
        }
        const alquiler = await insertPaymentService(objRent, req.body);
        res.json(alquiler);

    } catch (error) {
        res.status(707).json({ message: 'Error to try GET Rent object.' })
    }

}

export async function createAlquilerCtrl(req: Request, res: Response) {
    try {
        // const {idclient, idctner, fecha} = req.body;
        const { ptr_client, ptr_ctner } = req.body;
        // const fecha = Date.now();
        const alquiler = await createAlquilerService(ptr_client, ptr_ctner, Date.now());
        res.json(alquiler);

    } catch (error) {
        res.status(730).json({ status: 730, message: 'Error to try create Alquiler object!' });
    }
}