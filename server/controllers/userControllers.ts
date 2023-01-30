import { Request, Response } from "express";
import { RequestUser } from "../config/interface";
import Users from "../models/userModel"
import bcrypt from "bcrypt"
class UserController {

    async confirmAccount(req: RequestUser, res: Response) {
        try {
            const { id } = req.params;

            const user = await Users.findById(id);
            if (!user) return res.status(400).json({ msg: "Người dùng không tồn tại." })

            await Users.findByIdAndUpdate(user._id, {
                confirm: true
            })

            return res.json({ msg: "Cập nhập thành công." });

        } catch (error: any) {
            return res.status(500).json({ msg: error.message });
        }
    }

    async getTeachers(req: Request, res: Response) {
        try {
            const teachers = await Users.find({
                role: "teacher",
                confirm: false
            })
            return res.json({ teachers })
        } catch (err: any) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async updateUser(req: RequestUser, res: Response) {
        if (!req.user) return res.status(400).json({ msg: "Xác thực không hợp lệ" })
        try {
            const { name, avatar } = req.body;

            await Users.findByIdAndUpdate(req.user?._id, { name, avatar });

            return res.json({ msg: "Cập nhật thông tin thành công" })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async resetPassword(req: RequestUser, res: Response) {
        if (!req.user) return res.status(400).json({ msg: "Xác thực không hợp lệ" })
        try {
            const { password } = req.body;
            const passwordHash = await bcrypt.hash(password, 12);

            await Users.findByIdAndUpdate({ _id: req.user._id }, {
                password: passwordHash
            })

            return res.json({ msg: "Cập nhật mật khẩu thành công." })


        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

}

export default new UserController;