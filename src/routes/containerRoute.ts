import { Router } from 'express';

import {
    getContainersCtrl,
    getContainerOneCtrl,
    createContainerCtrl,
    updateContainerCtrl,
    deleteContainerCtrl
} from "../controllers/containerController";


class Container 
{
    public router: Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/', getContainersCtrl);
        this.router.get('/:id', getContainerOneCtrl);
        this.router.post('/', createContainerCtrl);
        this.router.put('/:id', updateContainerCtrl);
        this.router.delete('/:id', deleteContainerCtrl);
    }
}
const container = new Container();

export default container.router;