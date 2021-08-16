import Client, { IClient } from "../models/Client";
import { ObjectID } from "mongodb";

export async function getClientsService() {
    try {
        await Client.find();
    } catch (error) {
        throw Error(error);
    }

};

async function getClientOneService(id: ObjectID) {
    try {
        return await Client.findById(id);
    } catch (error) {
        throw Error(error);

    }
};

async function createClientService(objclient: IClient) {
    try {
        return await objclient.save();
    } catch (error) {
        throw Error(error);

    }
}

async function updateClientService(id:ObjectID, objclient:IClient) {
    try {
        return await Client.findByIdAndUpdate(id, objclient);
    } catch (error) {
        throw Error(error);
    }
};

