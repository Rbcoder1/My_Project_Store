import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

// configuring cloudinary 
cloudinary.config({
    cloud_name: process.env.ClOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been uploaded successufully 
        console.log("file uploaded on cloudinary", response.url);
        return response;
    } catch (err) {
        fs.unlinkSync(localFilePath)  //remove the locally saved temporary file as the upload fails
        return null;
    }
}

export { uploadFileOnCloudinary };