import { Router } from "express";

import { 
    createPagoCtrl,
    getPagosCtrl
 } from "../controllers/pagoController";

class pagoRoute 
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