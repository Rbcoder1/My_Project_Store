import { Review } from "../models/reviews.model";

const verifyReview = async (req, res, next) => {

    const reviewId = req.params.id;

    const review = await Review.findById(reviewId)

    if (!review) {
        return res.status(400)
            .json({
                error: "Review Not Found"
            })
    }

    if (req.user?._id !== review?.userId) {
        return res.status(401)
            .json({
                error: "Unauthorized User"
            })
    }

    next()
}

export { verifyReview }