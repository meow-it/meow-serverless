import micro from "micro-cors";
import dbConnect from "../../../lib/dbConnect"
import Meow from "../../../models/Meow"

async function handler(req, res) {

	const { method } = req

    if (req.method === 'OPTIONS') {
        return res.status(200).send({message: "This was a response to a preflight request"})
    }

    if(method != "PUT") return res.status(400).json({ success: false, message: "Invalid request method, Try sending with PUT Method" })

    await dbConnect()

    try {
        let like = 1

        let userid = req.body.userid
        if (!userid) return res.status(400).send({ message: "Does not have an userid" })

        let meowid = req.body.meowid
        if (!meowid) return res.status(400).send({ message: "Does not have a meowid" })

        let meow = await Meow.findById(meowid)
        if (!meow) return res.status(400).send({ message: "Meow Does not Exist" })

        like = req.body.like !== undefined ? req.body.like : like

        res.status(202).send({ message: "The Meow has been liked" })

        if(like == 1) {
            await Meow.findByIdAndUpdate(meowid, {
                $inc: { likes: 1 },
                $addToSet: { likedBy: userid }
            })
        } else {
            await Meow.findByIdAndUpdate(meowid, {
                $inc: { likes: -1 },
                $pull: { likedBy: userid }
            })
        }


    } catch (err) {
        res.status(500).send({ message: "Unable to Like Meow 😖" })
        console.log(err)        
    }

}

const cors = micro();

export default cors(handler);