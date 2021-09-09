
import { Router } from "express";

import {
    createPaymentCtrl,
    createAlquilerCtrl,
    print,
} from "../controllers/rentalController";

class Rental {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();

    }
    routes() {
        this.router.post('/', createAlquilerCtrl);
        // this.router.post('/', print);
        this.router.post('/pago/', createPaymentCtrl);
    }

}

const alquiler: Rental = new Rental();

export default alquiler.router;