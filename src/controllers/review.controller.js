import { Review } from "../models/reviews.model.js"

//add review on project
const addReviewOnProject = async (req, res) => {

    const { comment, rating } = req.body;

    if (!comment || !rating) {
        return res.status(400)
            .json({
                error: "Values Must Be Required"
            })
    }

    const projectId = req.params.id;

    if (!projectId) {
        return res.status(400)
            .json({
                error: "Project Id Not Found"
            })
    }

    const review = await Review.create({
        appId: projectId,
        userId: req.user._id,
        comment,
        rating
    })

    return res.status(200)
        .json({
            review,
            msg: "Review Added Successfully"
        })
}

