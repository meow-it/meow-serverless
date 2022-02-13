import micro from "micro-cors";
import dbConnect from "../../../lib/dbConnect"
import User from "../../../models/User"
import Comment from "../../../models/Comment";
import Meow from "../../../models/Meow"
import { hasProfane } from "../functions"

async function handler(req, res) {

	const { method } = req

    if (req.method === 'OPTIONS') {
        return res.status(200).send({message: "This was a response to a preflight request"})
    }

    if(method != "POST") return res.status(400).json({ success: false, message: "Invalid request method, Try sending with POST Method" })

    await dbConnect()

    try {

        let { meowId, userId, text } = req.body
        if(!meowId || !userId || !text) return res.status(400).send({ message: "Make sure you sent all the required fields 🙁: meowId, userId, text" })

        let meow = await Meow.findById(meowId)
        if (!meow) return res.status(404).send({ message: "Meow with ID not found 🙁" })

        let user = await User.findById(userId)
        if (!user) return res.status(404).send({ message: "User with ID not found 🙁" })

        if (!text) return res.status(400).send({ message: "Comment Text cannot be null 😦" })

        let toxic = hasProfane(text)
        let name = user.name
        let profilePic = user.profilePic

        let comment = await Comment.create({ text, toxic, name, profilePic, commentedTo: meowId })
        res.status(201).send(comment)

        await Meow.findByIdAndUpdate(meowId, { $push: { comments: comment._id } })

    } catch (err) {
        res.status(500).send({ message: "Unable to Create New Meow 😖" })
        console.log(err)
    }

}

const cors = micro();

export default cors(handler);