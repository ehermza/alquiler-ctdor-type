import { Request, Response} from "express";
import  Debt, {IDebt} from "../models/Debt";

export async function getListDebts(req:Request, res:Response) 
{
    try {
        const list: Array<IDebt> = [];
        
    } 
    catch (error) {
        res.status(914).json({
            status:914,
            message: "Error to try get list debts"
        });
    }
}