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

        let { meowid, userid } = req.body

        if (!userid) return res.status(400).send({ message: "Does not have an userid" })
        let user = await User.findById(userid)
        if (!user) return res.status(400).send({ message: "User Does not Exist 😡" })

        if (!meowid) return res.status(400).send({ message: "Does not have a meowid" })

        let meow = await Meow.findById(meowid)
        if (!meow) return res.status(400).send({ message: "Meow Does not Exist" })

        let likedBy = meow.likedBy

        let like = likedBy.includes(userid) ? -1 : 1

        res.sendStatus(202)

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