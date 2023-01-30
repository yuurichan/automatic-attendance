import { Request, Response, NextFunction } from "express";
import { DecodeToken, RequestUser } from '../config/interface'
import jwt from 'jsonwebtoken'
import Users from '../models/userModel'

export const auth = async (req: RequestUser, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization");
    
        if (!token) return res.status(400).json({ msg: "Ivalid Authentication." })

        const decode = <DecodeToken>jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
        if (!decode) return res.status(400).json({ msg: "Ivalid Authentication." })

        const user = await Users.findById(decode.id);
        if (!user) return res.status(400).json({ msg: "This account is not exist." })

        req.user = user;

        next();
    } catch (error: any) {
        return res.status(500).json({ msg: error.message })
    }
}

export const authAdmin = async (req: RequestUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(400).json({ msg: "Ivalid Authentication." })
        }      
        // Check role
        if (req.user.role !== "admin") return res.status(400).json({ msg: "You are not admin." });

        next()
    } catch (error: any) {
        return res.status(500).json({ msg: error.message })
    }
}