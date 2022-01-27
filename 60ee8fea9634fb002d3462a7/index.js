export default function (req, res) {
	return res.status(201).send("Spica is awesome!");
}

export function test(change) {
	console.log(change.kind + " action has been
}