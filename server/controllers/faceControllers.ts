import { Request, Response } from 'express'
import { ILabledFaceDescriptor } from '../config/interface'
import labledFaceDescriptorsModel from '../models/labledFaceDescriptorsModel'
import mongoose from 'mongoose'
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
        console.log(req.body);
        const data: ILabledFaceDescriptor = req.body;
        console.log(data);

        // Luu len MongoDB
        let newLabeldFaceDesc = new labledFaceDescriptorsModel(data);
        newLabeldFaceDesc = await newLabeldFaceDesc.save()

        // Luu file json
        const pathFile = `${__dirname}/../descriptors/${data.label}.json`
        fs.writeFileSync(pathFile, JSON.stringify(data))

        return res.json({ 
            msg: "Lưu model thành công",
            //data: data._doc
        })

    } catch (error: any) {
        console.log(error.message)
        return res.status(500).json({ msg: error.message })
    }
}

/// purely test func to test API responses and MongoDB data transferring
export const getDescriptors_guest = async (req: Request, res: Response) => {
    try {

        //const { studentCodeList } = req.body;
        const studentCodeList  = ["B1Tuan Tu", "B2Tuan Tu"];
        const normalDesc = [[2, 3, 4], [5, 6, 7], [8, 9, 10]];

        const dir = `${__dirname}/../descriptors`

        const data = await fs.readdirSync(dir)
            // .filter(filename => {
            //     var file = path.basename(filename, path.extname(filename));
            //     return file === studentCodeList.find((studentCode: any) => {
            //         return studentCode.toLowerCase() === file.toLowerCase()
            //     })
            // })
            .map(name => require(path.join(dir, name)))
        const mongo_data = await labledFaceDescriptorsModel.find({label: {$in: studentCodeList}}, {label: 1, descriptors: 1, _id: 0})
        
        // find test
        //const mongo_data2 = await labledFaceDescriptorsModel.find({"label": "B3Tuan Tu"})
        // let mongo_data2 = await labledFaceDescriptorsModel.find({"label": "B2Tuan Tu"})
        // // It's always going to be true btw
        // if (mongo_data2) {
        //     console.log('Initial data: ', mongo_data2)
        //     // push another number array with value [2]
        //     await labledFaceDescriptorsModel.updateOne({"label": "B2Tuan Tu"}, {$push: {descriptors: {$each: normalDesc}}}, {new: true})
        // }
        // else {
        //     console.log("Data does not exist");
        // }
        //console.log('Updated data: ', mongo_data2)
        // Well if you dont grab it again or set option {new: true}(?) how are you going to 
        // print the latest value

        return res.json({ descriptors: mongo_data, msg: "Lấy các descriptors thành công" })

    } catch (error: any) {
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

/// funcs to work with mongoDB
export const saveLabledFaceDescriptors_DB_guest = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const data: ILabledFaceDescriptor = req.body;
        console.log(data);

        // Luu len MongoDB
        //if ((await labledFaceDescriptorsModel.find({"label": data.label})).length !== 0)
        //let newLabeldFaceDesc = new labledFaceDescriptorsModel(data);
        //newLabeldFaceDesc = await newLabeldFaceDesc.save();

        await labledFaceDescriptorsModel.updateOne({"label": data.label},
                                                    //{$set: {label: data.label}, $push: {descriptors: data.descriptors[0]}},
                                                    {$set: {label: data.label}, $push: {descriptors: {$each: data.descriptors}}},
                                                    {upsert: true}
        )

        return res.json({ 
            msg: "Lưu model thành công",
        })

    } catch (error: any) {
        console.log(error.message)
        return res.status(500).json({ msg: error.message })
    }
}
export const saveLabledFaceDescriptors_DB = async (req: Request, res: Response) => {
    try {
        //console.log(req.body);
        const data: ILabledFaceDescriptor = req.body;
        //console.log(data);

        // Luu len MongoDB
        //if ((await labledFaceDescriptorsModel.find({"label": data.label})).length !== 0)
        //let newLabeldFaceDesc = new labledFaceDescriptorsModel(data);
        //newLabeldFaceDesc = await newLabeldFaceDesc.save();

        await labledFaceDescriptorsModel.updateOne({"label": data.label},
                                                    {$set: {label: data.label, descriptors: data.descriptors}},
                                                    {upsert: true}
        )

        return res.json({ 
            msg: "Lưu model thành công",
        })

    } catch (error: any) {
        console.log(error.message)
        return res.status(500).json({ msg: error.message })
    }
}
export const getDescriptors_DB = async (req: Request, res: Response) => {
    try {

        const { studentCodeList } = req.body;
        const mongo_data = await labledFaceDescriptorsModel.find({label: {$in: studentCodeList}}, {label: 1, descriptors: 1, _id: 0})
        console.log(mongo_data);
        return res.json({ descriptors: mongo_data, msg: "Lấy các descriptors thành công" })

    } catch (error: any) {
        return res.status(500).json({ msg: error.message })
    }
}