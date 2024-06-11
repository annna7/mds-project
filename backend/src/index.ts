import { connect, seedDatabase } from './database';
import app from './app';

const port = app.get('port');

connect().then(() => {
	console.log('Database connected');
	seedDatabase().then(() => {
		console.log('Database seeded');
		app.listen(port, () => {
			console.log(`Server is running at http://localhost:${port}`);
		});
	}).catch((error) => {
		console.error('Database seeding failed');
	});
});
