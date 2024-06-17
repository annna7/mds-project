import { connect, seedDatabase } from './database';
import app from './app';
///import {Server} from 'socket.io';
import {createServer} from 'node:http';
import { Server } from 'socket.io';

const port = app.get('port');

const server = createServer(app);
const io = new Server(server, {
	cors: {origin: '*'}
});

io.on('connection', (socket) => {
	console.log('Client connected');

	socket.on('join', (roomId) => {
		socket.join(roomId);
		console.log('Socket joined room ', roomId);
	});

	socket.on('newMessage', (msg) => {
		const roomId = msg.senderId < msg.receiverId ?
			`${msg.senderId}-${msg.receiverId}` :
			`${msg.receiverId}-${msg.senderId}`;
		console.log(`New message sent to ${roomId}`);
		socket.broadcast.emit('messageReceived', msg);
	});

	socket.on('updateMessages', (msg) =>{
		const roomId = msg.senderId < msg.receiverId ?
			`${msg.senderId}-${msg.receiverId}` :
			`${msg.receiverId}-${msg.senderId}`;
		socket.broadcast.emit('updateMessages', msg);

	});

});

connect().then(() => {
	console.log('Database connected');
	seedDatabase().then(() => {
		console.log('Database seeded');
		server.listen(port, () => {
			console.log(`Server is running at http://localhost:${port}`);
		});
	}).catch((error) => {
		console.error('Database seeding failed');
	});
});
