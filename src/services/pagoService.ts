import Pago, {IPago} from '../models/Pago';

export async function getPagosService() 
{
    try {
        return await Pago.find();

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