import { Router } from "express";
import { addReviewOnProject, updateReviewOnProject } from "../controllers/review.controller.js"
import { auth } from "../middlewares/auth.middleware.js";
import { verifyReview } from "../middlewares/verifyReview.middleware.js";

const router = Router()

router.route("/addReview").post([auth], addReviewOnProject)
router.route("/updateReview/:id").post(
    [
        auth,
        verifyReview
    ],
    updateReviewOnProject
)

export default router;