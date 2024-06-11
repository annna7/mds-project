import React from 'react';
import { Text, View } from 'react-native';
import Button from '../components/Button';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { useAuth, useUser } from '@clerk/clerk-expo';
import userService from '../services/internal/userService';
import Background from '../components/Background';

export const CreateReviewScreen: React.FC = () => {
	const { onboardingStep, setOnboardingStep } = useUserDetails();
	const { user } = useUser();
	const { signOut } = useAuth();

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
		<Background>
			<View>
				<Text style={{ fontSize: 40 }} >TODO: Create Review Screen</Text>
				{isFirstTimeUser && <Button onPress={handleContinue}>Continue</Button>}
			</View>
			<Button onPress={() => signOut()}>Sign Out</Button>
		</Background>
	);
};
