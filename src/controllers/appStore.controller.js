import { appStore } from '../models/appStore.model.js'
import { uploadFileOnCloudinary } from '../utils/cloudinary.js';

const addProject = async (req, res) => {

    // fetching and validating request fields 
    const { title, description, category, developer, preview_link } = req.body;
    if (
        [title, description, category, developer, preview_link].some((field) => field?.trim() === "")
    ) {
        return res.status(400).json({
            "error": "Please Fill Required Fields"
        })
    }

    // accessing local file path from request injected by multer middleware
    const logoLocalPath = req.files?.logo_images[0]?.path;
    const previewLocalPath = req.files?.preview_images[0]?.path;

    if (!logoLocalPath) {
        return res.status(400).error("logo image is required")
    }

    // uploading local files on cloudinary and return files link 
    const logo_image = await uploadFileOnCloudinary(logoLocalPath);
    const preview_image = await uploadFileOnCloudinary(previewLocalPath);

    if (!logo_image) {
        res.status(500).error("logo image not found")
    }

    // storing appProject on database 
    const newApp = await appStore.create({
        title,
        description,
        logo_images: logo_image.url,
        preview_images: preview_image?.url || "",
        category,
        developer,
        preview_link
    })

    const checkedApp = await appStore.findById(newApp._id)
    if (!checkedApp) {
        return res.status(501).error("something went wrong when adding project")
    }

    return res.status(201).json(newApp);
}

export { addProject }