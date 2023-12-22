import mongoose from "mongoose";

const reviewsSchema = mongoose.Schema(
    {
        appId: {
            type: mongoose.Schema.Types.ObjectId,
            Ref: 'AppStore',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            Ref: 'User'
        },
        comment: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        }
    }, { timestamp: true }
)

export const Review = mongoose.model('Review', reviewsSchema);