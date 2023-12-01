import mongoose from "mongoose";

const downloadSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            Ref: 'User'
        },
        appId: {
            type: mongoose.Schema.Types.ObjectId,
            Ref: 'AppStore'
        }
    }, { timestamp: true }
)

export const download = mongoose.model('Download', downloadSchema);