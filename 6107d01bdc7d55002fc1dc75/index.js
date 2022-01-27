import * as Bucket from "@spica-devkit/bucket";
import { database } from "@spica-devkit/database";

let db;

export default async function () {
    let totalMs = 0;
    Bucket.initialize({ apikey: "3q2qr019kpgxd1rw", publicUrl: "http://127.0.0.1:4300" });
    let success = 0
    for (let i = 0; i < 2000; i++) {
        const begin = Date.now()
        await Bucket.data.getAll("61235757eee0d9002d44b99a").then(() => success++).catch(() => success--)
        const end = Date.now();
        totalMs += end - begin
    }
    return [totalMs, success];
}

export async function Database() {
    if (!db) {
        db = await database();
    }
    
    console.log("WORKED");
    let success = 0
    let totalMs = 0;
    for (let i = 0; i < 2000; i++) {
        const begin = Date.now()
        await db.collection("bucket_61235757eee0d9002d44b99a").find().toArray().then(() => success++).catch(() => success--);
        const end = Date.now();
        totalMs += end - begin
    }

    console.log(totalMs, success);
    return [totalMs, success]
}
