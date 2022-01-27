export default function (change) {
	console.log(change.kind + " action has been performed on document with id " + change.documentKey + " of collection " + change.collection);
	console.log("Document: ",change.document);
}