export default function (req, res) {
	console.log("Commit test")
	return res.status(201).send("Spica is awesome!");
}