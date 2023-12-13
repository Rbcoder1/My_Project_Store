import { appStore } from '../models/appStore.model.js'
import { uploadFileOnCloudinary } from '../utils/cloudinary.js';

//api that add project in database
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
        res.status(500).send("logo image not found")
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
        return res.status(501).send("something went wrong when adding project")
    }

    return res.status(201).json(newApp);
}

//api that update project in database
const updateProject = async (req, res) => {

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

    // uploading local files on cloudinary and return files link 
    const logo_image = await uploadFileOnCloudinary(logoLocalPath);
    const preview_image = await uploadFileOnCloudinary(previewLocalPath);


    try {
        const updatedProject = await appStore.findOneAndUpdate({ _id: req.params.id }, {
            title,
            description,
            logo_images: logo_image?.url,
            preview_images: preview_image?.url,
            category,
            developer,
            preview_link
        })

        return res.status(200).json(updatedProject)

    } catch (e) {
        return res.status(500).json({
            "error": "Internal server Error",
            "msg": e
        })
    }

}

//api that delete project in database
// api that query projects in database 

export { addProject, updateProject }