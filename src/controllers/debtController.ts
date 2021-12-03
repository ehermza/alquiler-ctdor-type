import { Request, Response} from "express";
import  Debt, {IDebt} from "../models/Debt";
import {
    getDebtInfoService
} from "../services/debtService"

export async function getListDebts(req:Request, res:Response) 
{
    try {
        const list: IDebt[] = await getDebtInfoService();
        res.json(list);
        
    } 
    catch (error) {
        res.status(914).json({
            status:914,
            message: "Error to try get list debts"
        });
    }
}

