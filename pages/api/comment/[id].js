import micro from "micro-cors";
import dbConnect from "../../../lib/dbConnect"
import Comment from "../../../models/Comment";
import Meow from "../../../models/Meow"

async function handler(req, res) {
	const {
		query: { id },
		method,
	} = req

	await dbConnect()

	if (method === 'OPTIONS') {
        return res.status(200).send({message: "This is a response to a preflight request"})
    }

	if(method == "GET") {
		try {

			if(!id) return res.status(400).json({message: "Please provide an id"})
			let meow = await Meow.findById(id).populate({ path: "comments", options: { sort: { createdAt: -1 } } })
	
			if (!meow) return res.status(404).send({ message: "Meow with ID not found 🙁" })
	
			res.status(200).send(meow.comments)
		} catch (err) {
			res.status(200).send({ message: "Make sure you sent a correct meowid. Unable to Query for some reason 😦" })
			console.log(err)
		}
	} else {
		res.status(400).json({ success: false, message: "Invalid request method 😒, Try sending with GET Method" })
	}
}

const cors = micro();

export default cors(handler);
