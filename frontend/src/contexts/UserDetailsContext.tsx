import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import { UserRoleEnum } from '../enums';
import {Socket} from "socket.io";
import {io} from "socket.io-client";
import {API_HOST, API_PORT} from "@env";

interface UserDetails {
	onboardingStep: number,
	setOnboardingStep: React.Dispatch<React.SetStateAction<number>>,
	profilePictureUrl?: string,
	setProfilePictureUrl: React.Dispatch<React.SetStateAction<string>>,
	role: UserRoleEnum,
	setRole: React.Dispatch<React.SetStateAction<UserRoleEnum>>,
	userId: string
	setUserId: React.Dispatch<React.SetStateAction<string>>,
	contactedUsers: string[],
	setContactedUsers: React.Dispatch<React.SetStateAction<string[]>>,
	socket: Socket | null;
	setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

const defaultUserDetails: UserDetails = {
	onboardingStep: 1,
	setOnboardingStep: () => {},
	profilePictureUrl: '',
	setProfilePictureUrl: () => {},
	role: UserRoleEnum.RegularUser,
	setRole: () => {},
	userId: '',
	setUserId:() => {},
	contactedUsers: [],
	setContactedUsers: () => {},
	socket: null,
	setSocket: () => {},
};

const UserDetailsContext = createContext<UserDetails>(defaultUserDetails);

interface UserDetailsProviderProps {
	children: ReactNode,
}

export const UserDetailsProvider: React.FC<UserDetailsProviderProps> = ({ children }) => {
	const [onboardingStep, setOnboardingStep] = useState<number>(1);
	const [profilePicture, setProfilePicture] = useState<string>('');
	const [role, setRole] = useState<UserRoleEnum>(UserRoleEnum.RegularUser);
	const [userId, setUserId] = useState<string>('');
	const [contactedUsers, setContactedUsers] = useState<string[]>([]);
	const [socket, setSocket] = useState<Socket>(null);

	useEffect(() => {
		if (userId) {
			const newSocket = io(`http://${API_HOST}:${API_PORT}`, {
				query: { userId: userId }
			});

			setSocket(newSocket);

			return () => {
				newSocket.disconnect();
			};
		}
	}, [userId]);


	return (
		<UserDetailsContext.Provider value={{ onboardingStep, setOnboardingStep, profilePictureUrl: profilePicture, setProfilePictureUrl: setProfilePicture, role, setRole, userId, setUserId, contactedUsers, setContactedUsers, socket, setSocket }}>
			{children}
		</UserDetailsContext.Provider>
	);
};

export const useUserDetails = () => useContext(UserDetailsContext);
