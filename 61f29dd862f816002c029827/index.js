export default function (req, res) {
	console.log("Commit test")
	console.log("test pull")
	return res.status(201).send("Spica is awesome!");
}
