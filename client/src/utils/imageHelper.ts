import axios from "axios"
export const checkImageUpload = (file: File) => {
    const errors: string[] = []
    if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "jpg") {
        errors.push("Định dạng file không hợp lệ")
    }

    if (file.size > 1024 * 1024) { // 1MB
        errors.push("Kích thước ảnh lớn tối đa 1MB")
    }

    return errors;
}

export const uploadImage = async (file: File) => {

    const cloundName = "dxnfxl89q"

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gtniwjmn");
    formData.append("cloud_name", cloundName)

    const url: string = `https://api.cloudinary.com/v1_1/${cloundName}/image/upload`;

    const res = await axios({
        url,
        method: "POST",
        data: formData,
        headers:{
            "Content-type":"multipart/form-data"
        }
    })
    
    const photo = res.data;
    return photo;

}