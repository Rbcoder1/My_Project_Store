import { Router } from "express";
import { upload } from '../middlewares/multer.middleware.js'
import { auth } from '../middlewares/auth.middleware.js'
import {
    addProject,
    deleteProject,
    fetchAllProject,
    updateProject,
    updateProjectLogoImage,
    updateProjectPreviewImages
} from "../controllers/appStore.controller.js";

const router = Router();

router.route('/add-project').post(
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
router.route('/fetch-projects').get(fetchAllProject)

// secured routes 
router.route('/update-project/:id').patch([auth], updateProject)
router.route('/update-project-logo-image/:id').patch([auth], updateProjectLogoImage)
router.route('/update-project-preview-image/:id').patch([auth], updateProjectPreviewImages)
router.route('/delete-project/:id').delete([auth], deleteProject)

export default router;