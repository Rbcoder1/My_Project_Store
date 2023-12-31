import { appStore } from '../models/appStore.model.js'
import {
    deleteFileFromCloudinary,
    uploadFileOnCloudinary
} from '../utils/cloudinary.js';

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

//api that update project text information in database
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

    try {
        const updatedProject = await appStore.findOneAndUpdate({ _id: req.params.id }, {
            title,
            description,
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

// api that update logo images of project in database 
const updateProjectLogoImage = async (req, res) => {
    const logoLocalPath = req.file?.path

    if (!logoLocalPath) {
        return res.status(400)
            .json({
                error: "Logo Image Not Found"
            })
    }

    const logoImage = await uploadFileOnCloudinary(logoLocalPath)

    if (!logoImage) {
        return res.status(400)
            .json({
                error: "Error While Uploading Image"
            })
    }

    const project = await appStore.findByIdAndUpdate(
        { _id: req.user?._id },
        {
            $set: {
                logo_images: logoImage?.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200)
        .json({
            project,
            msg: "Logo Image Updated"
        })
}

//api that update preview_images of project in database
const updateProjectPreviewImages = async (req, res) => {
    const previewLogoImage = req.file?.path

    if (!previewLogoImage) {
        return res.status(400)
            .json({
                error: "Preview Image Not Found"
            })
    }

    const previewImage = await uploadFileOnCloudinary(previewLogoImage)

    if (!previewImage) {
        return res.status(400)
            .json({
                error: "Error While Uploading Image"
            })
    }

    const project = await appStore.findByIdAndUpdate(
        { _id: req.params?.id },
        {
            $set: {
                preview_images: previewImage?.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200)
        .json({
            project,
            msg: "Logo Image Updated"
        })
}

//api that delete project in database
const deleteProject = async (req, res) => {

    const { projectId } = res.params;

    if (!projectId) {
        return res.status(400)
            .json({
                error: "Project Id Not Found"
            })
    }

    const project = await appStore.findById(projectId)

    //delete file from cloudinary 
    await deleteFileFromCloudinary(project?.previewImage)
    await deleteFileFromCloudinary(project?.logoImage)

    //delete project from database


    //return respose
}

// api that query projects in database 
const fetchAllProject = async (req, res) => {

    const projects = await appStore.find()

    return res.status(200)
        .json({
            projects
        })
}

export {
    addProject,
    updateProject,
    updateProjectLogoImage,
    updateProjectPreviewImages,
    deleteProject,
    fetchAllProject
}