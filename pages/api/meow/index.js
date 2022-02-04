import micro from "micro-cors";
async function handler(_, res) {

	res.status(200).send({ message: "Meow API is online" })

}

const cors = micro();

export default cors(handler);
