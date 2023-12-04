import mongoose from "mongoose";

const appStoreSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        logo_images: {
            type: String,
            required: true
        },
        preview_images: {
            type: [
                {
                    type: String,
                }
            ],
        },
        category: {
            type: String,
            required: true
        },
        developer: {
            type: String,
            required: true
        },
        preview_link: {
            type: String,
            required: true
        }
    }, { timestamp: true }
)

export const appStore = mongoose.model('AppStore', appStoreSchema);