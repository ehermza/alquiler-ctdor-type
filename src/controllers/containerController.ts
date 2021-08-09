import { Request, Response } from "express";
import Container, { IContainer } from '../models/Container';
import { ObjectID } from 'mongodb';
import { 
    getContainerOneServ,
    createContainerServ,
    updateContainerServ,
    deleteContainerServ,
 } from "../services/productService"

export async function createContainerCtr(req:Request, res:Response) {
    try {
        const {id, price, rented, active} = req.body;
    } 
    catch (error) {
        res.status(500).json({status:500, message:'Failed to create the container!'});
    }
}
