import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export const auth = async (req: Request, res: Response, next:NextFunction) =>{
    try{
    const authorisation = req.headers.authorization;
    if(authorisation == undefined){
        return res.status(401).send({
            status:"Error",
            message: "Please login to your account!"
        })
    }
    const pin = authorisation.split(" ")[1];
    if (!pin || pin === ""){
        return res.status(401).send({
            status:"Error",
            message: "Authorisation Failed!"
        })
    }

    const decoded = jwt.verify(pin, "Daniely")
    if ("user" in req){
        req.user = decoded
    }
    return next()
}catch (err){
    console.log(err);
    
}
}