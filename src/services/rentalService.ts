
import Rental, { IRental, RgtPago } from '../models/Rental';
import { ObjectID } from "mongodb";

export async function deletePaymentService(idPayment: string) {
    try {

    } catch (error) {

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
export async function deletePaymentByCtnerServ(recibo: string, idCtner: string)

 {
    try {
        const filter: any = {
            'id_container': idCtner,
            'active': true
        }
        console.log(filter);
        const objRent: IRental | null = await Rental.findOne(filter);
        if (!objRent) return null;        /** don't can find an active rental */

        // console.log(recibo);
         console.log (objRent.pagos_register);
        /**
         * Delete the Payment Register on Rental object (by Recibo number) */
        const register: Array<RgtPago> =
            objRent.pagos_register.filter((item) => 
                 (item.recibo_n!= recibo)
            );
        objRent.pagos_register = register;

        var vartotal:number = 0;
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

// export async function insertPaymentService(objRent:IRental, pago:RgtPago)
export async function insertPaymentService(objRent: IRental, body: any) {
    try {
        const { container, value, recibo_n } = body;

        const pago: RgtPago = {
            value: parseFloat(value),
            period: 'periodo',
            paid_at: new Date(),
            recibo_n: recibo_n
        }
        // await Rental.findByIdAndUpdate(objRent._id);
        objRent.pagos_register.push(pago);
        await objRent.save();

        var totalAct: number = objRent.pagos_total;
        totalAct += pago.value;
        await objRent.update({
            pagos_total: totalAct
        });
        return objRent;

    } catch (error) {

    }

}

