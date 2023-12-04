import { Router } from "express";
import { addProject } from "../controllers/appStore.controller.js";
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

export default router;