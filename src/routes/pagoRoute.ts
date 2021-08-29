import { Router } from "express";

import { 
    createPagoCtrl,
    getPagosCtrl
 } from "../controllers/pagoController";

class Pago
{
    router:Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/', getPagosCtrl);
        this.router.post('/', createPagoCtrl);
    }
}
const pago = new Pago();

export default pago.router;