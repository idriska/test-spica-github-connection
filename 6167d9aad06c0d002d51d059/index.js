import { database } from "@spica-devkit/database";
let db;
export default async function (req, res) {
	if (!db) {
		db = await database();
	}

	for (let i = 0; i < 100; i++) {
		db.collection("bucket_61a9ec8ba0abfe002d459386").insertOne({
			title: i.toString(),
			description: i.toString()
		}).then(console.log).catch(console.log)
	}

	return "OK"


}



export function test2() {
	console.log(process.env.asd)
	return true
}

export async function testIndex() {
	if (!db) {
		db = await database();
	}
	let indexes = await db.collection(`bucket_61e562230cffb9002d35cabe`).indexes();
	console.log(indexes)

	return true
}