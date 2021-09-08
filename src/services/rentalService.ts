
import Rental, { IRental, RgtPago } from '../models/Rental';

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
export async function getRentalObjectServ(idClient: string, idCtner: string)
 {
        try {
            // "id_container": idCtner
            // "id_client": idClient,
            const filter:any = {}
            console.log( '(getRentalObjectServ) filter: ', filter);
            const ver= await Rental.findOne(filter).exec();
            console.log(ver);
            return ver;
            // return await Rental.findOne(filter);
                
        } catch (error) {
            
        }
}

export async function insertPaymentService(objRent:IRental, pago:RgtPago)
 {
    try {
        if (!objRent) return -1;

        // await Rental.findByIdAndUpdate(objRent._id);
        objRent.pagos_register.push(pago);
        await objRent.save();

        var totalAct:number = objRent.pagos_total;
        totalAct += pago.value;
        await objRent.update({
            pagos_total: totalAct
        });

        return objRent;
        // this.pagos_register.push(pago);
        // this.pagos_total+= importe;

        // // return true;
        // return (this.deuda_total - this.pagos_total);

    } catch (error) {

    }

}

