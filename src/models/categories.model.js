import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        }
    }, { timestamp: true }
)

export const Category = mongoose.model('Category', categorySchema);