import { Request, Response } from "express";
import { ObjectID } from "mongodb"

import {
    getRentalObjectServ,
    insertPaymentService,
    createAlquilerService,
    getPaymentByCtnerServ,
    getSaldoByCtnerService,
    deletePaymentByCtnerServ,
    getRentalByCtnerService,
    getMonthNumberService,
    insertDebtService
} from "../services/rentalService";

import { getContainerOneServ } from "../services/containerService";
import { RgtPago, IRental } from "../models/Rental";
import { Number } from "mongoose";
import { IContainer } from "../models/Container";

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

export async function getRentalByCtnerController(req: Request, res: Response) {
    try {
        const { idctner } = req.params;
        const rental: any = await getRentalByCtnerService(idctner);
        if (!rental) {
            res.status(569).json({ status: 569, message: 'Rental object requested is not exists.' })
        }
        res.json(rental);

    } catch (error) {
        res.status(579).json({ status: 579, message: 'Error to try get Alquiler object.' });
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

export async function getMonthNumberController(req: Request, res: Response) {
    // this shit works! jojo..
    try {
        const { idctner } = req.params;
        const ra = await getMonthNumberService(idctner);
        res.json(ra);
    } catch (error) {

    }
}

export async function createDebtController(req: Request, res: Response) {
    try {
        // const { container, value, recibo_n } = req.body;   
        const { idctner } = req.params;
        const objCtner: IContainer | null =
            await getContainerOneServ(new ObjectID(idctner));
            
        if (!objCtner) {
            res.status(714).json({ message: 'Container object not defined!' });
            return;
        }
        const idclient: string = objCtner.rented_by_id;
        const price: number = objCtner.price_tocharge;

        const objRent: any = await getRentalObjectServ(idclient, idctner);
        if (!objRent) {
            res.status(710).json({ message: 'Rental object is null or undefined.' })
            return;
        }
        const alquiler = await insertDebtService(objRent, price);
        res.json(alquiler);

    } catch (error) {
        res.status(707).json({ message: 'Error to try GET Rent object.' })
    }

}

/**

export async function insertDebtController(req: Request, res: Response) {
    try {
        const { idctner } = req.params;
        const price = await insertDebtService(idctner);
        if (price == -1) {
            res.status(779).json({ status: 779, message: "Error to try get Container Price." });
        }
        const rpta= {
            "price_tocharge": price
        }
        res.json(rpta);

    } catch (error) {

    }
}
*/