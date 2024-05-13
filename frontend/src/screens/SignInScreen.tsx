import React, { useState } from 'react';
import { TextInput } from '../components';
import { Text, StyleSheet } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import Background from '../components/Background';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Spinner from 'react-native-loading-spinner-overlay';

const signInValidationSchema = Yup.object().shape({
	emailAddress: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string().required('Password is required'),
});

export default function SignInScreen() {
	const { signIn, setActive, isLoaded } = useSignIn();
	const [invalidPassword, setInvalidPassword] = useState(false);
	const [spinnerVisible, setSpinnerVisible] = useState(false);

	const handleSignIn = async (values, actions) => {
		if (!isLoaded) return;

		try {
			setSpinnerVisible(true); // Start the spinner when sign-in process starts

			const completeSignIn = await signIn.create({
				identifier: values.emailAddress,
				password: values.password,
			});

			await setActive({ session: completeSignIn.createdSessionId });

			// Stop the spinner when sign-in process is complete
			setSpinnerVisible(false);
		} catch (err) {
			setInvalidPassword(true);
			console.log(JSON.stringify(err));
			setSpinnerVisible(false); // Stop the spinner if there's an error
			if ((err as Error).message === 'Password is incorrect. Try again, or use another method.') {
				setInvalidPassword(true);
				actions.setFieldError('password', 'Incorrect password. Please try again.');
			}
		}
	};

	return (
		<Background>
			<Spinner visible={spinnerVisible} textContent={'Loading....'} />
			<Logo />
			<Formik
				initialValues={{ emailAddress: '', password: '' }}
				validationSchema={signInValidationSchema}
				onSubmit={handleSignIn} // Pass the custom submit function
			>
				{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
					<>
						<TextInput
							label="Email"
							returnKeyType="next"
							autoCapitalize="none"
							value={values.emailAddress}
							placeholder="Email..."
							onChangeText={handleChange('emailAddress')}
							onBlur={handleBlur('emailAddress')}
							error={!!(touched.emailAddress && errors.emailAddress)}
							errorMessage={touched.emailAddress && errors.emailAddress ? errors.emailAddress : undefined}
						/>

						<TextInput
							label="Password"
							returnKeyType="done"
							secureTextEntry={true}
							value={values.password}
							placeholder="Password..."
							onChangeText={handleChange('password')}
							onBlur={handleBlur('password')}
							error={!!(touched.password && errors.password)}
							errorMessage={errors.password as string}
						/>
						{invalidPassword && <Text style={{ color: 'red' }}>Invalid email or password. Please try again.</Text>}



						<Button mode="contained" onPress={() => handleSubmit()}>
							Sign In
						</Button>
					</>
				)}
			</Formik>
		</Background>
	);
}

