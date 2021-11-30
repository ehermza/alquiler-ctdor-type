
import { Router } from "express";

import {
    createPaymentCtrl,
    createAlquilerCtrl,
    getPaymentByCtnerCtrl,
    getSaldoByCtnerCtrl, 
    deletePaymentCtrl, 
    getRentalByCtnerController,
    getMonthNumberController, 
    insertDebtController
} from "../controllers/rentalController";

class Rental {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();

    }
    routes() {
        this.router.post('/', createAlquilerCtrl);
        this.router.get('/container/:idctner', getRentalByCtnerController);
        this.router.post('/pagos/', createPaymentCtrl);      // insert new payment to database
        this.router.get('/pagos/:id', getPaymentByCtnerCtrl);   // get all payments of client by container active,
        this.router.get('/saldo/:id', getSaldoByCtnerCtrl);     // get difer. (pagos_total - deuda_total)
        this.router.delete('/pagos/:recibo&:idctner', deletePaymentCtrl);
        
        this.router.get('/fecha/:idctner', getMonthNumberController);
        // this.router.get('/insertdebt/:idctner', insertDebtController);      
        this.router.get('/insertdebt/', insertDebtController);      
            //  November 04th, 2021!
    }

}

const alquiler: Rental = new Rental();

export default alquiler.router;