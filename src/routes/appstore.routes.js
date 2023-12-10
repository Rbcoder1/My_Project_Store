import { Router } from "express";
import { addProject, updateProject } from "../controllers/appStore.controller.js";
import { upload } from '../middlewares/multer.middleware.js'

const router = Router();

router.route("/add-project").post(upload.fields([
    {
        name: "logo_images",
        maxCount: 1
    },
    {
        name: "preview_images",
        maxCount: 4
    }
]), addProject);

router.route("/update-project").put(upload.fields([
    {
        name: "logo_images",
        maxCount: 1
    },
    {
        name: "preview_images",
        maxCount: 4
    }
]), updateProject)

export default router;