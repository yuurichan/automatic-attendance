import { Request, Response } from 'express'
import { ILabledFaceDescriptor } from '../config/interface'
import fs from 'fs'
import path from 'path'

export const saveLabledFaceDescriptors = async (req: Request, res: Response) => {
    try {
        const data: ILabledFaceDescriptor = req.body;

        // Luu file json
        const pathFile = `${__dirname}/../descriptors/${data.label}.json`
        fs.writeFileSync(pathFile, JSON.stringify(data))

        return res.json({ msg: "Lưu model thành công" })

    } catch (error: any) {
        console.log(error.message)
        return res.status(500).json({ msg: error.message })
    }
}

export const saveLabledFaceDescriptors_guest = async (req: Request, res: Response) => {
    try {
        const data: ILabledFaceDescriptor = req.body;

        // Luu file json
        const pathFile = `${__dirname}/../descriptors/${data.label}.json`
        fs.writeFileSync(pathFile, JSON.stringify(data))

        return res.json({ msg: "Lưu model thành công" })

    } catch (error: any) {
        console.log(error.message)
        return res.status(500).json({ msg: error.message })
    }
}

export const getDescriptors = async (req: Request, res: Response) => {
    try {

        const { studentCodeList } = req.body;

        const dir = `${__dirname}/../descriptors`

        const data = await fs.readdirSync(dir)
            .filter(filename => {
                var file = path.basename(filename, path.extname(filename));
                return file === studentCodeList.find((studentCode: any) => {
                    return studentCode.toLowerCase() === file.toLowerCase()
                })
            })
            .map(name => require(path.join(dir, name)))

        return res.json({ descriptors: data, msg: "Lấy các descriptors thành công" })

    } catch (error: any) {
        return res.status(500).json({ msg: error.message })
    }
}
