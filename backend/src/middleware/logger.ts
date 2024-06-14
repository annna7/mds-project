import { Request, Response, NextFunction } from 'express';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const now = new Date().toISOString();
	console.log(`${now} - ${req.method} ${req.path} - IP: ${req.ip} - ${res.statusCode}`);
	next();
};

export default loggerMiddleware;