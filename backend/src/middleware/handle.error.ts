import {Request,Response,NextFunction} from "express";

interface CustomError extends Error {
    status?: number;
    msg?:string;
}

const handleError = (err:CustomError,req:Request,res:Response,next:NextFunction)=>{
    res.status(err.status||500).json({message:err.msg || "Something went wrong"})
}

export default handleError;