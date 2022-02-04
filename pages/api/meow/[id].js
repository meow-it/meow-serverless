import dbConnect from "../../../lib/dbConnect"
import Meow from "../../../models/Meow"

export default async function handler(req, res) {
	const {
		query: { id },
		method,
	} = req

	await dbConnect()

	if(method == "GET") {
		try {
			let meow = await Meow.findById(id)
			if (!meow) return res.status(404).send({ message: "Meow with the sent ID does not exist 🙁" })
			res.status(200).send(meow)
		} catch (err) {
			res.status(400).send({ message: "Unable to query for some reason 😟" })
			console.log(err)
		}
	} else {
		res.status(400).json({ success: false, message: "Invalid request method 😒, Try sending with GET Method" })
	}
}
