import micro from "micro-cors";
import dbConnect from "../../../lib/dbConnect"
import User from "../../../models/User"
import Comment from "../../../models/Comment"
import { deepSearchForProfane } from "../functions"

async function handler(req, res) {

	const { method } = req

    if (req.method === 'OPTIONS') {
        return res.status(200).send({message: "This was a response to a preflight request"})
    }

    if(method != "PUT") return res.status(400).json({ success: false, message: "Invalid request method, Try sending with PUT Method" })

    await dbConnect()

    try {

        let { userId, commentId } = req.body

        if (!userId) return res.status(400).send({ message: "Does not have an userId" })
        if (!commentId) return res.status(400).send({ message: "Does not have a commentId" })

        let user = await User.findById(userId)
        if (!user) return res.status(404).send({ message: "User with ID not found 🙁" })

        let comment = await Comment.findById(commentId)
        if (!comment) return res.status(404).send({ message: "Comment with ID not found 🙁" })

        if(comment.toxic) return res.status(400).send({ message: "Comment is already labeled as toxic 🙁" })
        if(comment.isReviewed) return res.status(400).send({ message: "Comment has already been sent for review 😒" })

        res.status(202).send({ message: "Comment has been sent for review 😏" })

        await Comment.findByIdAndUpdate(commentId, { $set: { isReviewed: true } })

        // TODO: Handle Review with the Toxic API 
        // Instead: Checking the text again for profane words

        if(deepSearchForProfane(comment.text)) {
            await Comment.findByIdAndUpdate(commentId, { $set: { toxic: true } })
        }

    } catch (err) {
        res.status(500).send({ message: "Unable to review the comment. Try again 😖" })
        console.log(err)        
    }

}

const cors = micro();

export default cors(handler);