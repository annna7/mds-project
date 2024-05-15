import React, {useState} from 'react';
import { Text, View } from 'react-native';
import Button from '../components/Button';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { useAuth, useUser } from '@clerk/clerk-expo';
import userService from '../services/internal/usersService';
import Background from '../components/Background';
import Spinner from 'react-native-loading-spinner-overlay';
export const CreateReviewScreen: React.FC = () => {
	const { onboardingStep, setOnboardingStep } = useUserDetails();
	const { user } = useUser();
	const { signOut } = useAuth();
	const [spinnerVisible, setSpinnerVisible] = useState(false);
	const isFirstTimeUser = onboardingStep !== 3;
	const handleContinue = async () => {
		if (isFirstTimeUser) {
			const nextOnboardingStep = onboardingStep + 1;
			if (!user || !user.id) {
				throw new Error('User not initialized properly');
			}
			setSpinnerVisible(true);
			await userService.updateUser(user.id, { onboardingStep: nextOnboardingStep });
			setOnboardingStep(nextOnboardingStep);
			setSpinnerVisible(false);
		}
	};
	return (
		<Background>
			<Spinner visible={spinnerVisible} textContent={'Loading....'} />
			<View>
				<Text style={{ fontSize: 40 }} >TODO: Create Review Screen</Text>
				{isFirstTimeUser && <Button onPress={handleContinue}>Continue</Button>}
			</View>
			<Button onPress={() => signOut()}>Sign Out</Button>
		</Background>
	);
};
