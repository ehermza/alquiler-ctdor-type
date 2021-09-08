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
        this.router.get('/', getPagosCtrl);
        this.router.get('/:idclient&:nctner', getPagosByClientCtrl);
        // this.router.post('/', createPagoCtrl);
        this.router.post('/', createPaymentCtrl);
    }
}
const pago = new Pago();

export default pago.router;