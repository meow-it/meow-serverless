import micro from "micro-cors";
import dbConnect from "../../../lib/dbConnect"
import User from "../../../models/User"
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

        let userid = req.body.userid
        if (!userid) return res.status(400).send({ message: "Invalid userid" })

        let user = await User.findById(userid)
        if (!user) return res.status(400).send({ message: "User Does not Exist" })

        let text = req.body.text
        if (!text) return res.status(400).send({ message: "Text Cannot be Null" })

        let toxic = hasProfane(text)
        let name = user.name
        let profilePic = user.profilePic

        let latitude = parseFloat(req.body.latitude)
        let longitude = parseFloat(req.body.longitude)

        if (!latitude || !longitude) return res.status(400).send({ message: "Invalid coordinates" })

        let location = {
            type: "Point",
            coordinates: [longitude, latitude]
        }

        let meow = await Meow.create({
            text,
            toxic,
            location,
            name,
            profilePic
        })

        res.status(201).send(meow)

        await User.findByIdAndUpdate(userid, {
            $push: {
                meows: meow._id
            }
        })

        
    } catch (err) {
        res.status(500).send({ message: "Unable to Create New Meow 😖" })
        console.log(err)
    }

}

const cors = micro();

export default cors(handler);