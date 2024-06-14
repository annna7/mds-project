import { useEffect, useState } from 'react';
import { IUser } from '../models';
import userService from '../services/internal/userService';

export const useUserData = (userId: string) => {
	const [user, setUser] = useState<IUser>();
	const [error, setError] = useState(null);

	useEffect(() => {
		userService.getWithClerkDetails(userId)
			.then(data => {
				setUser(data);
			})
			.catch(err => {
				setError(err);
			});
	}, );

	return { user, error };
};
