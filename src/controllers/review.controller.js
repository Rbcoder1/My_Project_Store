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

//update review
const updateReviewOnProject = async (req, res) => {

    const { comment, rating } = req.body

    if (!comment || !rating) {
        return res.status(400)
            .json({
                error: "Value Must Be Required"
            })
    }

    const updatedReview = await Review.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                comment,
                rating
            }
        },
        { new: true }
    )

    if (!updatedReview) {
        return res.status(500)
            .json({
                error: "Error While Updating Review"
            })
    }

    return res.status(200)
        .json({
            review: updatedReview,
            msg: "Review Update Successfully"
        })
}

export {
    addReviewOnProject,
    updateReviewOnProject
}