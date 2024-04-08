import React from 'react';
import { Text, View } from 'react-native';
import Button from '../components/Button';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { useUser } from '@clerk/clerk-expo';
import userService from '../api/services/usersService';

export const CreateReviewScreen: React.FC = () => {
	const { onboardingStep, setOnboardingStep } = useUserDetails();
	const { user } = useUser();

	const isFirstTimeUser = onboardingStep !== 3;
	const handleContinue = async () => {
		if (isFirstTimeUser) {
			const nextOnboardingStep = onboardingStep + 1;
			if (!user || !user.id) {
				throw new Error('User not initialized properly');
			}

			await userService.updateUser(user.id, { onboardingStep: nextOnboardingStep });
			setOnboardingStep(nextOnboardingStep);
		}
	};
	return (
		<View>
			<Text style={{ fontSize: 40 }} >TODO: Create Review Screen</Text>
			<Button mode="contained" onPress={handleContinue}>
				Continue
			</Button>
		</View>
	);
};
