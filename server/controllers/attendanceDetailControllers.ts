import { Request, Response } from 'express'
import attendanceDetailModel from '../models/attendanceDetailModel';

class AttentdanceControllers {
    async updateAttendanceDetail(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const { absent, note } = req.body;

            const attendanceDetail = await attendanceDetailModel.findByIdAndUpdate(id, {
                absent, note
            })

            return res.json({ msg: "Cập nhật thành công", attendanceDetail })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }
}


export default new AttentdanceControllers;