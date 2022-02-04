import micro from "micro-cors";
import dbConnect from "../../../lib/dbConnect"
import Meow from "../../../models/Meow"

async function handler(req, res) {

	const { method } = req

    if (req.method === 'OPTIONS') {
        return res.status(200).send({message: "This was a response to a preflight request"})
    }

    if(method != "POST") return res.status(400).json({ success: false, message: "Invalid request method, Try sending with POST Method" })

    await dbConnect()

    try {
        let latitude = parseFloat(req.body.latitude)
        let longitude = parseFloat(req.body.longitude)

        if (!latitude || !longitude) return res.status(400).send({ message: "Invalid coordinates" })

        let meows = await Meow.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 5000
                }
            }
        }).sort({ createdAt: -1 })

        res.status(200).send(meows)

	} catch (err) {
		res.status(200).send({ message: "Unable to Query for some reason 😞" })
		console.log(err)
	}

}

const cors = micro();

export default cors(handler);