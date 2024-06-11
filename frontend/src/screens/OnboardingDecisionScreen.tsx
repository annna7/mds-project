import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useUserDetails } from '../contexts/UserDetailsContext';
import userService from '../services/internal/userService';
import { FurtherDetailsRegistrationScreen } from './FurtherDetailsRegistrationScreen';
import { CreateReviewScreen } from './CreateReviewScreen';
import { HomeScreen } from './HomeScreen';

export const OnboardingDecisionScreen = () => {
	const { onboardingStep, setOnboardingStep, setProfilePictureUrl, setRole } = useUserDetails();
	const { user } = useUser();

	useEffect(() => {
		if (user) {
			const userId = user.id;
			fetchAndStoreUserDetails(userId)
				.then((res) => console.log(res))
				.catch((err) => console.log(err));
		}
	}, [user]);

	const fetchAndStoreUserDetails = async (userId: string) => {
		const userDetails = await userService.getUserById(userId);
		setRole(userDetails.role);
		setOnboardingStep(userDetails.onboardingStep);
		setProfilePictureUrl(userDetails.profilePicture);
	};

	switch (onboardingStep) {
	case 1:
		return <FurtherDetailsRegistrationScreen/>;
	case 2:
		return <CreateReviewScreen/>;
	case 3:
		return <HomeScreen/>;
	}
};