import Pago, {IPago} from '../models/Pago';

export async function getPagosService() 
{
    try {
        return await Pago.find();

    } catch (error) {
        throw Error(error);
    }
}

export async function getPagosByClientService(idClient:string, nCtner:Number) 
{
    try {
        // return await Pago.find();
        const filter: any = {
            'client': idClient,
            'id_container': nCtner
        };
        return await Pago.find(filter);
    
    } catch (error) {
        throw Error(error);
    }
}

export async function createPagoService(objpago:IPago) 
{
    try {
        return await objpago.save();

    } catch (error) {
        throw Error(error);
    }
}