
import { Router } from "express";
import {
    getListDebts,
} from "../controllers/debtController"

class DebtInfo {

    router: Router;

    constructor(){
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get("/", getListDebts);

    }
}
const debtInfo: DebtInfo = new DebtInfo();

export default debtInfo.router;