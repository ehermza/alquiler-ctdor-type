import Client, { IClient } from "../models/Client";
import { ObjectID } from "mongodb";

export async function getClientsService() {
    try {
       return await Client.find();
    } catch (error) {
        throw Error(error);
    }

};

export async function getClientOneService(id: ObjectID) {
    try {
        return await Client.findById(id);
    } catch (error) {
        throw Error(error);

    }
};

export async function createClientService(objclient: IClient) {
    try {
        return await objclient.save();
    } catch (error) {
        throw Error(error);

    }
}

export async function updateClientService(id:ObjectID, objclient:IClient) {
    try {
        // console.log('(clientService) findByIdAndUpdate()', objclient);
        return await Client.findByIdAndUpdate(id, objclient);
    } catch (error) {
        console.log('(ERROR) findByIdAndUpdate()', objclient);
        throw Error(error);
    }
};

