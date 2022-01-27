let count = 0;
export default async function (req, res) {
    count++;

    if (count == 5) {
        return Promise.reject("asdasd");
    }

    return res.status(201).send("Spica is!");
}
