import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRoleEnum } from '../enums';

interface UserDetails {
	onboardingStep: number,
	setOnboardingStep: React.Dispatch<React.SetStateAction<number>>,
	profilePictureUrl?: string,
	setProfilePictureUrl: React.Dispatch<React.SetStateAction<string>>,
	role: UserRoleEnum,
	setRole: React.Dispatch<React.SetStateAction<UserRoleEnum>>,
}

const defaultUserDetails: UserDetails = {
	onboardingStep: 1,
	setOnboardingStep: () => {},
	profilePictureUrl: '',
	setProfilePictureUrl: () => {},
	role: UserRoleEnum.RegularUser,
	setRole: () => {},
};

const UserDetailsContext = createContext<UserDetails>(defaultUserDetails);

interface UserDetailsProviderProps {
	children: ReactNode,
}

export const UserDetailsProvider: React.FC<UserDetailsProviderProps> = ({ children }) => {
	const [onboardingStep, setOnboardingStep] = useState<number>(1);
	const [profilePicture, setProfilePicture] = useState<string>('');
	const [role, setRole] = useState<UserRoleEnum>(UserRoleEnum.RegularUser);

	return (
		<UserDetailsContext.Provider value={{ onboardingStep, setOnboardingStep, profilePictureUrl: profilePicture, setProfilePictureUrl: setProfilePicture, role, setRole }}>
			{children}
		</UserDetailsContext.Provider>
	);
};

export const useUserDetails = () => useContext(UserDetailsContext);
