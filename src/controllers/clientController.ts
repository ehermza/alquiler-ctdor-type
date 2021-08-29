import { Request, Response } from "express";
import Client, { IClient } from "../models/Client";
import { ObjectID } from "mongodb";

import {
    getClientsService,
    getClientOneService,
    createClientService,
    updateClientService,
} from "../services/clientService";

export async function getClientsCtrl(req: Request, res: Response) {
    try {
        const clients = await getClientsService();
        console.log(clients);
        res.json(clients);

    } catch (error) {
        res.status(507).json({ status: 507, message: 'Error to try get list of clients' })
    }
};

export async function getClientOneCtrl(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const client = await getClientOneService(new ObjectID(id));
        res.json(client);
    } catch (error) {
        res.status(510).json({ status: 510, message: 'Error to try get one client' });
    }
}

/* 
    export async function getClientByIdContCtrl(req:Request, res:Response) {
    try {
        const {idctner} = req.params;
        const client = await getContByNumberService(parseInt(idctner));
        console.log(`RE: getClientByIdContCtrl: ${client}`);

    } catch (error) {
        
    }
}
 */
export async function createClientCtrl(req: Request, res: Response) {
    try {
        const { name, telephone, cuit, business } = req.body;
        const client: IClient = new Client({
            name,
            telephone,
            DNI: cuit,
            business,
            rent_info: []
        });
        await createClientService(client);
        res.json(client);

    } catch (error) {
        res.status(504).json({ status: 504, message: 'Error to try create a new client' });
    }
};

export async function updateClientCtrl(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const objclient =   await updateClientService(new ObjectID(id), req.body);
        console.log('(clientController) updateClientCtrl(req,res) = ', req.params);
        res.json(objclient);
    } catch (error) {
        res.status(501).json({status:501, message: 'Error to try update a saved client'});
    }
}