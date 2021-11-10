
import Rental, { IRental, RgtPago, RgtDeuda } from '../models/Rental';
import { getPriceContainerService } from './containerService';

import { ObjectID } from "mongodb";

const strmonth: String = "ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SEP,OCT,NOV,DIC";

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
        throw Error(error);

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
        throw Error(error);
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
        throw Error(error);

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
        throw Error(error);

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
        throw Error(error);
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
        throw Error(error);
    }
}
export async function createAlquilerService(idClient: string, idCtner: string, fecha: number) {
    try {
        // const alquiler:IRental       
        const alquiler: IRental = new Rental(
            {
                id_client: idClient,
                id_container: idCtner,
                active: true,
                date_init: fecha,
                deuda_total: 0,
                deuda_register: [],
                pagos_total: 0,
                pagos_register: []
            }
        );
        const rental: IRental = alquiler;
        console.log(rental);
        return await rental.save();

    } catch (error) {
        throw Error(error);

    }
}

function queryNextMonth(period: string): string {
    var res: string = "";
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
     *  Averiguar valor que client debe pagar en el mes 'month'
     *      from Array 'deuda_register' (fromdatabase)
     */
    var valueToPay: number = 0;
    arDeudas.forEach(debt => {
        if (debt.period == (month)) {
            valueToPay = debt.value.valueOf();
        }
    });

    return valueToPay;

}
// export async function insertPaymentService(objRent:IRental, pago:RgtPago)
export async function insertPaymentService(objRent: IRental, body: any)
 {
    try {
        const { container, value, recibo_n } = body;
        const value_paid: number = value;
        const PerOriginal: string = objRent.last_payment.period;

        const PerProximo: string = queryNextMonth(PerOriginal);
        const arDeudas: RgtDeuda[] = objRent.deuda_register;
        const valueByPeriod: number = getValueByPeriod(arDeudas, PerProximo);

        const difer: number = + value_paid - valueByPeriod;
        const month: string = (difer < 0) ? PerOriginal : PerProximo;

        const importe:number = (difer < 0) ? value_paid : difer;

        const pago: RgtPago = {
            value: (importe),
            period: month,
            paid_at: new Date(),
            recibo_n: recibo_n
        }
        // await Rental.findByIdAndUpdate(objRent._id);
        objRent.pagos_register.push(pago);
        await objRent.save();

        await objRent.update({
            pagos_total: objRent.pagos_total + pago.value,
            // last_payment: `${month},0`
            last_payment: {
                period: month,
                a_cta: -1
            }
        });
        return objRent;

    } catch (error) {
        return -1;
    }

}

export async function insertDebtService(objRent: IRental, price: number): Promise<IRental | -1> {
    try {
        const debt: RgtDeuda = {
            value: price,
            period: 'ENE'
        }
        objRent.deuda_register.push(debt);
        await objRent.save();

        const total: number = objRent.deuda_total + price;
        await objRent.updateOne({
            deuda_total: total
        });
        console.log(objRent);

        return objRent;

    } catch (error) {
        throw Error(error);

    }
}