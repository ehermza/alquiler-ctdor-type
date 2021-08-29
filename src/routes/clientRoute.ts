import { Router } from "express";

import {
    getClientsCtrl,
    getClientOneCtrl,
    createClientCtrl,
    updateClientCtrl
} from "../controllers/clientController";

class Client {
    public router;
    constructor() {
        this.router = Router();
        this.routes();
    };

    routes() {
        this.router.get('/', getClientsCtrl);
        this.router.get('/:id', getClientOneCtrl);
        this.router.post('/', createClientCtrl);
        this.router.put('/:id', updateClientCtrl);
        // this.router.post('/update/:id', updateClientCtrl);

    }
};

const client = new Client();

export default client.router;
