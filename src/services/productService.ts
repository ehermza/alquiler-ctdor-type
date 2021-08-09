import Container, { IContainer } from "../models/Container"
import { ObjectID } from 'mongodb'

export async function getContainersServ() {
    try {
        return Container.find();
    }
     catch (error) {
        throw Error(error);
    }
}

export async function getContainerOneServ(id: ObjectID) {

    try {
        return await Container.findById(id);
    }
    catch (error) {
        throw Error(error);
    }
}

export async function createContainerServ(objprod: IContainer) {
    try {
        return await objprod.save();
        // console.log(objprod);
    }
    catch (error) {
        throw Error(error);
    }
}

export async function updateContainerServ(id:ObjectID, objprod:IContainer) {
    try {
        return await Container.findByIdAndUpdate(id, objprod);        
    } catch (error) {
        throw Error(error);
        
    }

}

export async function deleteContainerServ(id:ObjectID) {
    try {
        return Container.findByIdAndDelete(id);
    } catch (error) {
        throw Error(error);
        
    }
}

/**
 * Code written for ehermza Date: 08.agost/2021
 */
