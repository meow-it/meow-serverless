import mongoose from "mongoose"
let secondsToLive = 24 * 60 * 60
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    text: { type: String, required: true, trim: true },
    toxic: { type: Boolean, default: false },
    name: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    isReviewed: { type: Boolean, default: false },
    commentedTo: { type: Schema.Types.ObjectId, ref: "Meow" },
    createdAt: { type: Date, default: Date.now, index: { expireAfterSeconds: secondsToLive } }
})

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema)