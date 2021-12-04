
import Rental, { IRental, RgtPago, RgtDeuda } from '../models/Rental';
import { getPriceContainerService } from './containerService';

import { ObjectID } from "mongodb";

const strmonth: String = "OCT,NOV,DIC,ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SEP";

export async function getMonthNumberService(idCtner: string) {
    try {
        const arrayt = strmonth.split(',');
        const rental: IRental | null = await getRentalByCtnerService(idCtner);
        if (!rental) {
            return -1;
        }
        const fecha: Date = rental.date_init;
        return arrayt[fecha.getMonth()];

    } catch (error) {
        throw new Error();

    }
}

export async function getRentalByIdService(id: string) {
    try {
        return await Rental.findById(new ObjectID(id))
    } catch (error) {
        throw new Error();
    }
}

export async function getRentalByCtnerService(idCtner: string) {
    /**
     * Date: 19 Sept, 2021 
     * Get the object Rental from one Container actually active  */
    try {
        const filter: any = {
            'id_container': idCtner,
            'active': true
        }
        return await Rental.findOne(filter);

    } catch (error) {
        throw new Error();
    }
}

export async function getSaldoByCtnerService(idCtner: string): Promise<number> {
    try {
        const filter: any = {
            'id_container': idCtner,
            'active': true
        }
        console.log(filter);

        const alquiler: IRental | null = await Rental.findOne(filter);
        if (!alquiler) return -1;

        return (alquiler.deuda_total - alquiler.pagos_total);

    } catch (error) {
        throw new Error();

    }
}

export async function getPagosService() {
    try {

    } catch (error) {

    }

}
// export async function deletePaymentByCtnerServ(idPayment: string, idCtner: string)
export async function deletePaymentByCtnerServ(recibo: string, idCtner: string) {
    try {
        const filter: any = {
            'id_container': idCtner,
            'active': true
        }
        console.log(filter);
        const objRent: IRental | null = await Rental.findOne(filter);
        if (!objRent) return null;        /** don't can find an active rental */

        // console.log(recibo);
        console.log(objRent.pagos_register);
        /**
         * Delete the Payment Register on Rental object (by Recibo number) */
        const register: Array<RgtPago> =
            objRent.pagos_register.filter((item) =>
                (item.recibo_n != recibo)
            );
        objRent.pagos_register = register;

        var vartotal: number = 0;
        register.forEach((item) => {
            vartotal += item.value;
        });
        objRent.pagos_total = vartotal;
        objRent.save();
        // console.log(register);

        return objRent;

    } catch (error) {

    }

}
export async function getPaymentByCtnerServ(idCtner: string) {
    try {
        const filter: any = {
            'id_container': idCtner,
            'active': true
        }
        console.log(filter);
        const alquiler: IRental | null = await Rental.findOne(filter);
        if (!alquiler) return null;

        return await alquiler.pagos_register;

    } catch (error) {
        throw new Error();

    }
}
export async function getPagosByClientService(idClient: string, nCtner: Number) {
    try {
        // return await Pago.find();
        const filter: any = {
            'client': idClient,
            'id_container': nCtner
        };
        const alq: IRental | null = await Rental.findOne(filter);
        if (alq == null) return {};

        const register: Array<RgtPago> = alq.pagos_register;
        return register;

    } catch (error) {
        throw new Error();
    }
}
// insertPayment(importe: number, fecha: Date, per: String, recibo?:String): number
export async function getRentalObjectServ(idClient: string, idCtner: string) {
    try {
        const filter: any = {
            "id_client": idClient,
            "id_container": idCtner
        }
        console.log('(getRentalObjectServ) filter: ', filter);
        return await Rental.findOne(filter).exec();

    } catch (error) {
        throw new Error();
    }
}
export async function createAlquilerService(idClient: string, idCtner: string, idDebt: string, fecha: number) {
    try {
        // const alquiler:IRental       
        const alquiler: IRental = new Rental(
            {
                id_client: idClient,
                id_container: idCtner,
                id_debtinfo: idDebt,
                active: true,
                date_init: fecha,
                deuda_total: 0,
                deuda_register: [],
                pagos_total: 0,
                pagos_register: [], 
                last_payment: {
                    a_cta: 0, period: "OCT"
                }
            }
        );
        // const rental: IRental = alquiler;
        console.log("========(createAlquilerService)========")
        console.log(alquiler);
        return await alquiler.save();

    } catch (error) {
        throw new Error();

    }
}

function queryNextMonth(period: string): string 
{
    var res: string = "OCT";
    // const fromdatabase: string = objRent.last_payment.period;

    const meses: Array<string> = strmonth.split(',');
    for (var i = 0; i < 12; i++) {
        if (period == meses[i]) {
            res = meses[i + 1];
            break;
        }
    }
    return res;
}

function getValueByPeriod(arDeudas: Array<RgtDeuda>, month: string): number {
    /**
     *  Query value that client must to pay on period 'month'
     *      from Array 'deuda_register' (database)
     */
    console.log(arDeudas);

    var valueToPay: number = 0;
    arDeudas.forEach(debt => {
        if (debt.period == (month)) {
            valueToPay = debt.value.valueOf();
        }
    });

    return valueToPay;

}
// export async function insertPaymentService(objRent:IRental, pago:RgtPago)
async function insertPagoRegister(objRent: IRental, importe:number, mes:string, recibo:string)
 {
    const pago: RgtPago = {
        value: (importe),
        period: mes,
        paid_at: new Date(),
        recibo_n: recibo
    }
    objRent.pagos_register.push(pago);
    await objRent.save();
}

// export async function insertPaymentService(objRent: IRental, body: any):
export async function insertPaymentService(idclient:string, body: any):
     Promise<IRental|null> {
    /**
     * Client Payment: Try to register period correct to set payment.
     *     Date: Nov.09th 2021  Author: EHER/2021
     */
    try {
        const { container, value, recibo_n } = body;
        const objRent: IRental|null = 
            await getRentalObjectServ(idclient, container);

            if(!objRent) {
                return null;
            }
        console.log("===========(ALQUILER)===========");
        console.log(objRent);        

        const cta_anter: number = objRent.last_payment.a_cta;
        const value_paid: number = value + cta_anter;

        const PerOriginal: string = objRent.last_payment.period;
        const arDeudas: RgtDeuda[] = objRent.deuda_register;
        const valueByPeriod: number = getValueByPeriod(arDeudas, PerOriginal);
        
        const PerProximo: string = queryNextMonth(PerOriginal);
        const difer: number = + value_paid - valueByPeriod;
        const month: string = (difer < 0) ? PerOriginal : PerProximo;

        const vuelto: number = (difer < 0) ? value_paid : difer;

        if (difer >= 0) {
        /** If client canceled current period debt, then..
         *    put payment on db: 'pagos_register' property
         **/
            insertPagoRegister(objRent, valueByPeriod, PerOriginal, recibo_n);
            await objRent.update({
                pagos_total: objRent.pagos_total + valueByPeriod,
            });
        }
        await objRent.update({
            // pagos_total: objRent.pagos_total + value_paid,
            last_payment: {
                period: month, a_cta: vuelto
            }
        });
        return objRent;

    } catch (error) {
        return null;
    }

}

export async function insertDebtService(objRent: IRental, price: number): Promise<IRental> 
{
    try {
        const PerProximo = queryNextMonth(objRent.last_deuda_per);
        const debt: RgtDeuda = {
            value: price,
            period: PerProximo       // urgent to change!
        }
        objRent.deuda_register.push(debt);
        await objRent.save();

        // const total: number = objRent.deuda_total + price;
        await objRent.updateOne({
            deuda_total: objRent.deuda_total + price,
            last_deuda_per: PerProximo
        });

        return objRent;

    } catch (error) {
        throw new Error();

    }
}