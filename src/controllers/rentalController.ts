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

import { 
    getContainersServ,
     getContainerOneServ 
} from "../services/containerService";

import {updateDebtByPaymentService} from "../services/debtService";
import { RgtPago, IRental } from "../models/Rental";
import { Number } from "mongoose";
import { IContainer } from "../models/Container";
import { createDebtService, updateDebtService } from "../services/debtService";
import { IDebt } from "../models/Debt";

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
        const { container, value } = req.body;
        /** const container is 'id_container' property 
         *      from Container class */
        console.log(' (body) ', req.body);
        const objCtner:IContainer|null =
             await getContainerOneServ(new ObjectID(container));
        if (!objCtner) {
            res.status(714).json({ message: 'Container object not defined!' });
            return;
        }
        const idclient: string = objCtner.rented_by_id;
        const alquiler: IRental|null =
             await insertPaymentService(idclient, req.body);

        if (!alquiler) {
            res.status(710).json({ message: 'Can\'t create Payment: Rental Object is null or undefined.' })
            return;
        }
        const id_debt: string =
             alquiler.id_debtinfo.toString();
        await updateDebtByPaymentService(id_debt, parseFloat(value));

        res.json(alquiler);

    } catch (error) {
        res.status(707).json({ message: 'Error to try GET Rent object.' })
    }

}

export async function createAlquilerCtrl(req: Request, res: Response) {
    try {
        // const {idclient, idctner, fecha} = req.body;
        const { ptr_client, ptr_ctner, client_name, ctner_number } = req.body;
        console.log("=========(REQ.BODY)=========");
        console.log(req.body);

        // const fecha = Date.now();
        const debtinfo: IDebt | undefined =
            await createDebtService(ctner_number, client_name);
        if (!debtinfo) {
            res.status(711);
            return;
        }
        const ptr_debt: string = debtinfo._id;
        const alquiler = await createAlquilerService(ptr_client, ptr_ctner, ptr_debt, Date.now());
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

export async function insertDebtController(req: Request, res: Response) {
    try {
        // var aCtnersActive: IContainer[] = [];
        
        const ctners: IContainer[] = await getContainersServ();
        console.log("========(CONTAINERS TODOS)========");
        console.log(ctners);
        
        /** Filter Containers 'Activos' and then, insert debt. */
        var aCtners: IContainer[] =
        ctners.filter((container) => container.active);
        
        var errno: number = 0;
        var totaltoCharge: number = 0;

        aCtners.forEach(async function (container) {
            totaltoCharge += container.price_tocharge;
            errno= await insertDebtByCtner(container);
            if(errno) {
                res.status(errno).json({ status: errno})
                return;
            }
        });
          res.json( { totaltoCharge } );

    } catch (error) {
        res.status(770).json({
            status: 770,
            message: 'Error to Try Insert Deuda de todos los Alquileres Activos.-'
        })
    }
}

// export async function insertDebtController(req: Request, res: Response) 
async function insertDebtByCtner(ctnerObj: IContainer): Promise<number> {
    /**
     * Works OK! November,23th. 2021
     */
    try {
        // const objCtner: IContainer | null =
        //     await getContainerOneServ((idctnerObj));
        // if (!objCtner) {
        //     // res.status(714).json({ message: 'Container object not defined!' });
        //     return 714;
        // }
        const idctner: string = ctnerObj._id.toString();
        const idclient: string = ctnerObj.rented_by_id;
        const price: number = ctnerObj.price_tocharge;

        var alquiler: IRental | null = await getRentalObjectServ(idclient, idctner);
        if (!alquiler) {
            // res.status(710).json({ message: 'Rental object is null or undefined.' });
            return 710;
        }
        await insertDebtService(alquiler, price);

        alquiler = await getRentalObjectServ(idclient, idctner);
        if (!alquiler) {
            // res.status(710).json({ message: 'Rental object is null or undefined.' });
            return 711;
        }
        console.log("===============(ALQUILER)=================");
        console.log(alquiler);
        /**
         * Update Object Debt to print Debts table.
         */
        await updateDebtService(alquiler);

        return 0;

    } catch (error) {
        return 707;
        // res.status(707).json({ message: 'Error to try GET Rent object.' })
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