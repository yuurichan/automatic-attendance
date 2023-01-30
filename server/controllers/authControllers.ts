import { Request, Response } from "express";
import Users from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../config/generateToken";
import { UserLogin, UserRegister, DecodeToken } from "../config/interface";

// Controller
class AuthController {
    // Đăng kí
    async register(req: Request, res: Response) {
        try {
            const { name, account, password }: UserRegister = req.body;

            const user = await Users.findOne({ account });

            if (user)
                return res.status(409).json({ msg: "Username is already in use." });  // Conflict

            const passwordHasd = await bcrypt.hash(password, 12);

            const newUser = new Users({
                name,
                account,
                password: passwordHasd,
            });

            await newUser.save();
            return res.status(201).json({
                msg: "Đăng kí thành công! Đợi admin duyệt tài khoản của bạn.",
            });

        } catch (error: any) {
            return res.status(500).json({ msg: error.message });
        }
    }


    // Đăng nhập
    async login(req: Request, res: Response) {
        try {
            const { account, password }: UserLogin = req.body;

            const user = await Users.findOne({ account });

            // Find user
            if (!user)
                return res.status(400).json({ msg: "Tài khoản không tồn tại." });

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ msg: "Sai mật khẩu." });

            // Check account is confirm
            if (!user.confirm) {
                return res.status(401).json({ msg: "Tài khoản chưa được duyệt." })
            }

            const access_token = generateAccessToken({ id: user._id });
            const refresh_token = generateRefreshToken({ id: user._id });

            //  SET COOKIE
            res.cookie("refreshToken", refresh_token, {
                path: "/api/refresh_token",
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            return res.json({
                msg: "Đăng nhập thành công",
                user,
                access_token,
            });
            
        } catch (error: any) {
            return res.status(500).json({ msg: error.message });
        }
    }

    // Refresh Token -> {User, Access Token}
    async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken)
                return res.status(400).json({ msg: "Please login now." });

            const decode = await <DecodeToken>jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`);

            if (!decode) return res.status(400).json({ msg: "Please login now." });


            const user = await Users.findById(decode.id)
            if (!user) return res.status(400).json({ msg: "This account does not exist." })

            const access_token = generateAccessToken({ id: user._id });
            return res.json({
                user,
                access_token
            })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message });
        }
    }

    // Đăng xuất
    async logout(req: Request, res: Response) {
        try {
            res.clearCookie("refreshToken");
            return res.json({ msg: "Đăng xuất thành công." })
        } catch (error: any) {
            return res.status(500).json({ msg: error.message });
        }
    }
}

export default new AuthController();
