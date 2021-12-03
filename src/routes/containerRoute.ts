import { Router } from 'express';


import {
    getContainersCtrl,
    getContainerOneCtrl,
    createContainerCtrl,
    updateContainerCtrl,
    deleteContainerCtrl,
    getContbyNumberCtrl,
    insertContainersController
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
        this.router.get('/number/:idctner', getContbyNumberCtrl);
        this.router.post('/', createContainerCtrl);
        this.router.put('/:id', updateContainerCtrl);
        this.router.delete('/:id', deleteContainerCtrl);
            // this.router.post('/create/:number', insertContainersController); deprecated!
    }
}
const container = new Container();

export default container.router;