import micro from "micro-cors";
import dbConnect from "../../../lib/dbConnect"
import User from "../../../models/User"
import animals from "../animals"

async function handler(req, res) {
	const { method } = req

	await dbConnect()

	switch (method) {
		case "GET":
			res.status(200).send({ message: "User API is online" })
			break
		case "POST":
			try {
        
				let name = `${animals[Math.floor(Math.random() * animals.length)]} Chan`
				let profilePic = `https://avatars.dicebear.com/api/bottts/${name.replace(/\s/g, "")}.svg`
		
				let user = await User.create({ name, profilePic })
				res.status(201).send(user)
		
			} catch (err) {
				res.status(200).send({ status: false, message: "Something happened with the Server 🤦‍♀️" })
				console.log(err)
			}
			break
		default:
			res.status(400).json({ success: false })
			break
	}
}

const cors = micro()

export default cors(handler)
