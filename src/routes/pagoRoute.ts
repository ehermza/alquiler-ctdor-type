import { Router } from "express";

import { 
    createPagoCtrl,
    getPagosByClientCtrl,
    getPagosCtrl,
 } from "../controllers/pagoController";

 import {createPaymentCtrl} from "../controllers/rentalController";

class Pago
{
    router:Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
/**
 *  Functions Implemented in Rental model:
        this.router.post('/', createPaymentCtrl);
 **/        
        this.router.get('/', getPagosCtrl);
        this.router.get('/:idclient&:nctner', getPagosByClientCtrl);
        // this.router.post('/', createPagoCtrl);
    }
}
const pago = new Pago();

export default pago.router;