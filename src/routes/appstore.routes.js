import { Router } from "express";
import { addProject, updateProject } from "../controllers/appStore.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/add-project").post(
    [
        auth,
        upload.fields([
            {
                name: "logo_images",
                maxCount: 1
            },
            {
                name: "preview_images",
                maxCount: 4
            }
        ])
    ], addProject);

router.route("/update-project/:id").put(
    [
        auth,
        upload.fields([
            {
                name: "logo_images",
                maxCount: 1
            },
            {
                name: "preview_images",
                maxCount: 4
            }
        ])
    ], updateProject)


export default router;