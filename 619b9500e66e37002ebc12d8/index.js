export default function ({ socket, pool }, message) {
	console.log(message.name); // name is the event name that has been triggered
	console.log(message.data); // use this field to pass data from client to server
	const isAuthorized = true;
	if (isAuthorized) {
		socket.send("authorization", { state: true });
		pool.send("connection", { id: socket.id, ip_address: socket.remoteAddress });
	} else {
		socket.send("authorization", { state: false, error: "Authorization has failed." });
		socket.close();
	}
}