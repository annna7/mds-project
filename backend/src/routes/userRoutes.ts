import { Router } from 'express';
import { UserController } from '../controllers';

const userRouter = Router();

userRouter.post('/', UserController.createUser);
userRouter.put('/:clerkId', UserController.updateUser);
userRouter.get('/', UserController.getAllUsers);
userRouter.get('/:clerkId', UserController.getUser);
userRouter.get('/full/:clerkId', UserController.getFullUser);

export { userRouter };
