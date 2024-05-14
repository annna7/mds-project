import * as React from 'react';
import { useSignUp } from '@clerk/clerk-expo';
import Background from '../components/Background';
import { TextInput } from '../components';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Spinner from 'react-native-loading-spinner-overlay';
import { useState } from 'react';

export default function SignUpScreen() {
	const { isLoaded, signUp, setActive } = useSignUp();
	const [spinnerVisible, setSpinnerVisible] = useState(false);
	const [firstName, setFirstName] = React.useState('');
	const [lastName, setLastName] = React.useState('');
	const [username, setUsername] = React.useState('');
	const [emailAddress, setEmailAddress] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [code, setCode] = React.useState('');
	const [isPending, setIsPending] = React.useState(false);

	const renderFirstRegistrationStep = () => {
		return (
			<Background>
				<Spinner visible={spinnerVisible} textContent={'Loading....'} />
				<Logo/>
				<TextInput
					autoCapitalize="none"
					value={firstName}
					placeholder="First Name..."
					onChangeText={(firstName) => {
						setFirstName(firstName);
					}}
				/>
				<TextInput
					autoCapitalize="none"
					value={lastName}
					placeholder="Last Name..."
					onChangeText={(lastName) => {
						setLastName(lastName);
					}}
				/>
				<TextInput
					autoCapitalize="none"
					value={username}
					placeholder="Username..."
					onChangeText={(username) => {
						setUsername(username);
					}}
				/>
				<TextInput
					autoCapitalize="none"
					value={emailAddress}
					placeholder="Email..."
					onChangeText={(email) => {
						setEmailAddress(email);
					}}
				/>
				<TextInput
					value={password}
					placeholder="Password..."
					placeholderTextColor="#000"
					secureTextEntry={true}
					onChangeText={(password) => {
						setPassword(password);
					}}
				/>
				<Button mode="contained" onPress={onSignUpPress}>
					Continue
				</Button>
			</Background>
		);
	};

	const renderSecondVerificationStep = () => {
		return (
			<Background>
				<Spinner visible={spinnerVisible} textContent={'Loading....'} />
				<Logo/>
				<TextInput
					value={code}
					placeholder="Code..."
					onChangeText={(code) => {
						setCode(code);
					}}
				/>
				<Button mode="contained" onPress={onPressVerify}>
					Verify Email
				</Button>
			</Background>
		);
	};

	const onSignUpPress = async () => {
		if (!isLoaded) {
			return;
		}
		setSpinnerVisible(true);
		try {
			await signUp.create({
				firstName,
				lastName,
				username,
				emailAddress,
				password
			});

			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
			setSpinnerVisible(false);

			setIsPending(true);

		} catch (err: any) {
			console.error(JSON.stringify(err, null, 2));
			setSpinnerVisible(false);
		}
	};



	const onPressVerify = async () => {
		if (!isLoaded) {
			return;
		}
		setSpinnerVisible(true);
		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code
			});

			await setActive({ session: completeSignUp.createdSessionId });
			setSpinnerVisible(false);
		} catch (err: any) {
			console.error(JSON.stringify(err, null, 2));
			setSpinnerVisible(false);
		}
	};

	return (
		<>
			{isPending ? renderSecondVerificationStep() : renderFirstRegistrationStep()}
		</>
	);
}
