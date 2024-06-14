import React, { createContext, useContext, useState, ReactNode, SetStateAction } from 'react';
import { UserRoleEnum } from '../enums';
import { Schema }  from 'mongoose';

interface UserDetails {
	onboardingStep: number,
	setOnboardingStep: React.Dispatch<React.SetStateAction<number>>,
	profilePictureUrl?: string,
	setProfilePictureUrl: React.Dispatch<React.SetStateAction<string>>,
	role: UserRoleEnum,
	setRole: React.Dispatch<React.SetStateAction<UserRoleEnum>>,
	favoriteListings: string[],
	setFavoriteListings: React.Dispatch<SetStateAction<string[]>>,
}

const defaultUserDetails: UserDetails = {
	onboardingStep: 1,
	setOnboardingStep: () => {},
	profilePictureUrl: '',
	setProfilePictureUrl: () => {},
	role: UserRoleEnum.RegularUser,
	setRole: () => {},
	favoriteListings: [],
	setFavoriteListings: () => {},
};

const UserDetailsContext = createContext<UserDetails>(defaultUserDetails);

interface UserDetailsProviderProps {
	children: ReactNode,
}

export const UserDetailsProvider: React.FC<UserDetailsProviderProps> = ({ children }) => {
	const [onboardingStep, setOnboardingStep] = useState<number>(1);
	const [profilePicture, setProfilePicture] = useState<string>('');
	const [role, setRole] = useState<UserRoleEnum>(UserRoleEnum.RegularUser);
	const [favoriteListings, setFavoriteListings] = useState<string[]>([]);
	return (
		<UserDetailsContext.Provider value={{ onboardingStep, setOnboardingStep, profilePictureUrl: profilePicture, setProfilePictureUrl: setProfilePicture, role, setRole, favoriteListings, setFavoriteListings }}>
			{children}
		</UserDetailsContext.Provider>
	);
};

export const useUserDetails = () => useContext(UserDetailsContext);
