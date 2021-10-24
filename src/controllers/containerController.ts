import { Request, Response } from "express";
import Container, { IContainer } from '../models/Container';
import { ObjectID } from 'mongodb';
import {
    getContainersServ,
    getContainerOneServ,
    createContainerServ,
    updateContainerServ,
    deleteContainerServ,
    getContByNumberService,
} from "../services/containerService";

export async function getContainersCtrl(req: Request, res: Response) {
    try {
        const containers = await getContainersServ();
        res.json(containers);
    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'Failed to try find all containers from database' });
    }

}

export async function getContbyNumberCtrl(req: Request, res: Response) {
    try {
        const { idctner } = req.params;
        console.log(`req.params: idctner ${idctner}`);

        const client = await getContByNumberService(parseInt(idctner));
        console.log(`RE: getContbyNumberCtrl: ${client}`);

        res.json(client);

    } catch (error) {
        res.status(509).json({ status: 509, message: 'Failed to try get one client by Ctdor Id.' });
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
//        const { id, price, client, active } = req.body;
	const { id_container, price_tocharge, rented_by, active } = req.body;
        console.log(req.body);

        const container: IContainer = new Container({
            id_container,
            price_tocharge,
            rented_by,
            active
        });
        await createContainerServ(container);
        res.json(container);
    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'Failed to create the container!' });
    }
}
export async function insertContainersController(req:Request, res:Response)
 {
    // const TOTALCONT: number= 33;
    const {number} = req.params;
    try {
        const container: IContainer = new Container({
            id_container: parseInt(number),
            price_tocharge: 0,
            rented_by: '',
            active: false
        });
        await createContainerServ(container);
        res.json(container);
    } 
    catch (error) {
        
    }
}

export async function updateContainerCtrl(req: Request, res: Response) {
    /**
     *  PUT method, containers/:id
     */
    try {
        const { id } = req.params;
        const container = await updateContainerServ(new ObjectID(id), req.body);
        console.log(container);
        res.json(container);

    } catch (error) {
        res.status(500).json({ status: 500, message: 'Failed to try update one container...' });
    }

}
export async function deleteContainerCtrl(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const container = await deleteContainerServ(new ObjectID(id));
        res.json(container);
    }
    catch (error) {
        res.status(510).json({ status: 510, messsage: 'Failed to try delete one exists container' });
    }
}

/**
 * Code tsc written for author: ehermza Date: 09.agost/2021
 */
