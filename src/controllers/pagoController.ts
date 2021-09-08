import Pago, { IPago } from "../models/Pago";
import { Request, Response } from "express";
import {
    getPagosService,
    createPagoService,
    getPagosByClientService
} from "../services/pagoService";

export async function getPagosCtrl(req: Request, res: Response) {
    try {
        const pagos = await getPagosService();
        res.json(pagos);

    } catch (error) {
        res.status(506).json({ status: 506, message: 'Error to try get pagos from database' });
    }
}

export async function getPagosByClientCtrl(req: Request, res: Response) {
    try {
        const { idclient, nctner } = req.params;
        console.log(`idclient(${idclient}) nctner(${nctner})`);
        const pagos = await getPagosByClientService(idclient, parseInt(nctner));
        res.json(pagos);

    } catch (error) {
        res.status(506).json({ status: 506, message: 'Error to try get pagos from database' });
    }
}

export async function createPagoCtrl(req: Request, res: Response) {
    try {
        const pago: IPago = new Pago(req.body);

        // const { client, value, id_container, month_paid, paid_at,recibo } = req.body;
        /*         const pago: IPago = new Pago({
                    client: client,
                    value: value,
                    id_container,
                    month_paid,
                    paid_at,
                    recibo: recibo
                });
                */
        await createPagoService(pago);
        console.log(req.body);

    } catch (error) {
        res.status(510).json({ status: 510, message: 'Error to try create a new pay' });

    }
}