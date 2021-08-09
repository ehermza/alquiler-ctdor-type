import { Request, Response } from "express";
import Container, { IContainer } from '../models/Container';
import { ObjectID } from 'mongodb';
import {
    getContainersServ,
    getContainerOneServ,
    createContainerServ,
    updateContainerServ,
    deleteContainerServ,
} from "../services/productService"

export async function getContainersCtrl(req: Request, res: Response) {
    try {
        const containers = await getContainersServ();
        res.json(containers);
    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'Failed to try find all containers from database' });
    }

}

export async function getContainerOneCtrl(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const container = await getContainerOneServ(new ObjectID(id));
        res.json(container);

    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'Failed to try get one container from database' });
    }

}

export async function createContainerCtrl(req: Request, res: Response) {
    try {
        const { id, price, client, active } = req.body;
        const container: IContainer = new Container({
            id_cont: id,
            price_tocharge: price,
            rented_by: client,
            active: active
        });
        await createContainerServ(container);
        res.json(container);
    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'Failed to create the container!' });
    }
}

export async function updateContainerCtrl(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const container = await updateContainerServ(new ObjectID(id), req.body);
        console.log(container);
        res.json(container);

    } catch (error) {
        res.status(500).json({ status: 500, message: 'Failed to try update one container...' });
    }

}
export async function deleteContainerCtrl(req:Request, res:Response) {
    try {
        const {id} = req.params;
        const container = await deleteContainerServ(new ObjectID(id));
        res.json(container);
    } 
    catch (error) {
        res.status(510).json({status:510, messsage: 'Failed to try delete one exists container'});
    }
}