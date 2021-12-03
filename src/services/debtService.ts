// import Container, { IContainer } from '../models/Container';

import { ObjectID } from 'mongodb';
import { getRentalByCtnerService } from "../services/rentalService";
import Debt, { IDebt } from '../models/Debt';
import Rental, { IRental, RgtPago, RgtDeuda } from '../models/Rental';

let objRental: IRental | undefined = undefined;

export async function createDebtService(nCtner: number, client:string)
 {
     /**
      * This function execute just when create a new rental.
      * Date: Nov-20th.2021
      */
    try {
        const debtinfo:IDebt = new Debt({
            number_ctner: nCtner,
            name_client: client,
            current_debt: 0,
            price_rental: 0,
            overdue_debt: 0,
            paid_current_per: ''  
        });
        console.log("=============(NEW DEBT)=============");
        console.log(debtinfo);

       return  await debtinfo.save();

    } catch (error) {
        throw new Error();
    }
}

function getValueDebt(): number {
    var importe: number = -1;
    if (!objRental)
        return -1;
    
    const per = objRental.last_deuda_per;
    const arDeudas: RgtDeuda[] = objRental.deuda_register;
    arDeudas.forEach(deuda => {
        if (deuda.period == per) {
            importe = deuda.value;
        }
    });
    return importe;
}

export async function updateDebtService(alquiler:IRental) 
{
    try {
        objRental = alquiler;
         
        // const debtinfo: IDebt = Debt.findById(new ObjectID(id));
        const currentDebt: number =
            +objRental.deuda_total - objRental.pagos_total - objRental.last_payment.a_cta;
            // +objRental.deuda_total - objRental.pagos_total;
            
        const priceByMonth: number = getValueDebt();
        const difer:number = (currentDebt - priceByMonth);
        const atras:number = (difer > 0) ? difer: 0;
        
        const debt: any = {            
            current_debt: currentDebt,
            // current_debt: -1,
            price_rental: priceByMonth,
            overdue_debt: atras,   
            paid_current_per: '0'
        }
        const id: ObjectID = new ObjectID( objRental.id_debtinfo.toString());
        console.log("===========(DEBT-INFO)===========");
        console.log(debt);

        return  await Debt.findByIdAndUpdate(id, debt);

    } catch (error) {
        throw new Error();
    }
}

export async function getDebtInfoService() :Promise <IDebt[]>
{
    try {
        const aDebtInfo: IDebt[] = await Debt.find();
        console.log("===========(DEBT-TABLE-FIND)===========");
        console.log(aDebtInfo);

        return await aDebtInfo;

    } catch (error) {
        throw new Error();
    }
}