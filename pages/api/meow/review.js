import micro from "micro-cors";
import dbConnect from "../../../lib/dbConnect"
import Meow from "../../../models/Meow"
import { deepSearchForProfane } from "../functions"

async function handler(req, res) {

	const { method } = req

    if (req.method === 'OPTIONS') {
        return res.status(200).send({message: "This was a response to a preflight request"})
    }

    if(method != "POST") return res.status(400).json({ success: false, message: "Invalid request method, Try sending with POST Method" })

    await dbConnect()

    try {

        let userid = req.body.userid
        if (!userid) return res.status(400).send({ message: "Does not have an userid" })

        let meowid = req.body.meowid
        if (!meowid) return res.status(400).send({ message: "Does not have a meowid" })

        let meow = await Meow.findById(meowid)
        if (!meow) return res.status(400).send({ message: "Meow Does not Exist" })

        if(meow.toxic) return res.status(400).send({ message: "Meow is already labeled as TOXIC 😕" })

        if (meow.isReviewed) return res.status(400).send({ message: "Meow has already been sent for review 😒" })

        res.status(202).send({ message: "The Meow has been sent for review" })

        await Meow.findByIdAndUpdate(meowid, {
            $set: {
                isReviewed: true
            }
        })
        
        // TODO: Handle Review with the Toxic API 
        // Instead: Checking the text again for profane words with deepSearchForProfane()

        if(deepSearchForProfane(meow.text)) {
            await Meow.findByIdAndUpdate(meowid, {
                $set: {
                    toxic: true
                }
            })
        }


    } catch (err) {
        res.status(500).send({ message: "Unable to Like Meow 😖" })
        console.log(err)        
    }

}

const cors = micro();

export default cors(handler);