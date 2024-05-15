import * as React from 'react';
import { useSignUp } from '@clerk/clerk-expo';
import Background from '../components/Background';
import { TextInput } from '../components';
import { Text } from 'react-native';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Spinner from 'react-native-loading-spinner-overlay';
import { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';

const signUpValidationSchema = Yup.object().shape({
	emailAddress: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string().required('Password is required')
		.min(8, 'Password must be at least 8 characters')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter'),
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string().required('Last name is required'),
	username: Yup.string().required('Username is required').min(4, 'Username must be at least 4 characters'),
});
const verificationCodeValidationSchema = Yup.object().shape({
	code: Yup.number().required('Verification code is required').typeError('Verification code must be a number'),
});
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
	const [alreadyUsedMail, setAlreaduUsedMail] = useState(false);
	const renderFirstRegistrationStep = () => {
		return (
			<Background>
				<Spinner visible={spinnerVisible} textContent={'Loading....'} />
				<Logo/>
				<Formik
					initialValues={{ firstName: '', lastName: '', username: '', emailAddress:'', password:'' }}
					validationSchema={signUpValidationSchema}
					onSubmit={onSignUpPress}
				>
					{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
						<>
							<TextInput
								label="First Name"
								returnKeyType="next"
								autoCapitalize="none"
								value={values.firstName}
								placeholder="First Name..."
								onChangeText={handleChange('firstName')}
								onBlur={handleBlur('firstName')}
								error={!!(touched.firstName && errors.firstName)}
								errorText={touched.firstName && errors.firstName ? errors.firstName : undefined}
							/>

							<TextInput
								label="Last Name"
								returnKeyType="next"
								autoCapitalize="none"
								value={values.lastName}
								placeholder="Last Name..."
								onChangeText={handleChange('lastName')}
								onBlur={handleBlur('lastName')}
								error={!!(touched.lastName && errors.lastName)}
								errorText={touched.lastName && errors.lastName ? errors.lastName : undefined}
							/>

							<TextInput
								label="Username"
								returnKeyType="next"
								autoCapitalize="none"
								value={values.username}
								placeholder="Username..."
								onChangeText={handleChange('username')}
								onBlur={handleBlur('username')}
								error={!!(touched.username && errors.username)}
								errorText={touched.username && errors.username ? errors.username : undefined}
							/>

							<TextInput
								label="Email"
								returnKeyType="next"
								autoCapitalize="none"
								value={values.emailAddress}
								placeholder="Email..."
								onChangeText={handleChange('emailAddress')}
								onBlur={handleBlur('emailAddress')}
								error={!!(touched.emailAddress && errors.emailAddress)}
								errorText={touched.emailAddress && errors.emailAddress ? errors.emailAddress : undefined}
							/>
							{alreadyUsedMail && <Text style={{ color: 'red' }}>Email already used. Please provide another email address.</Text>}

							<TextInput
								label="Password"
								returnKeyType="done"
								placeholder="Password..."
								placeholderTextColor="#000"
								secureTextEntry={true}
								value={values.password}
								onChangeText={handleChange('password')}
								onBlur={handleBlur('password')}
								error={!!(touched.password && errors.password)}
								errorText={touched.password && errors.password ? errors.password : undefined}
							/>

							<Button mode="contained" onPress={() => handleSubmit()}>
								Continue
							</Button>
						</>
					)}
				</Formik>

			</Background>
		);
	};

	const renderSecondVerificationStep = () => {
		return (
			<Formik
				initialValues={{ code: '' }}
				validationSchema={verificationCodeValidationSchema}
				onSubmit={onPressVerify}
			>
				{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
					<Background>
						<Spinner visible={spinnerVisible} textContent={'Loading....'} />
						<Logo/>
						<TextInput
							value={values.code}
							placeholder="Code..."
							onChangeText={handleChange('code')}
							onBlur={handleBlur('code')}
							error={!!(touched.code && errors.code)}
							errorText={touched.code && errors.code ? errors.code : undefined}
						/>
						<Button mode="contained" onPress={() => handleSubmit()}>
							Verify Email
						</Button>
					</Background>
				)}
			</Formik>

		);
	};

	const onSignUpPress = async (values) => {
		if (!isLoaded) {
			return;
		}
		setSpinnerVisible(true);
		try {
			console.log(values.firstName);
			console.log(values.lastName);
			console.log(values.username);
			console.log(values.emailAddress);
			console.log(values.password);

			await signUp.create({
				firstName: values.firstName,
				lastName: values.lastName,
				username: values.username,
				emailAddress: values.emailAddress,
				password: values.password
			});

			console.log('am ajuns');

			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
			setSpinnerVisible(false);
			setIsPending(true);
		} catch (err) {
			setAlreaduUsedMail(true);
			console.error(JSON.stringify(err, null, 2));
			setSpinnerVisible(false);
		}
	};




	const onPressVerify = async (values) => {
		if (!isLoaded) {
			return;
		}
		setSpinnerVisible(true);
		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code: values.code // Access the verification code from Formik values
			});

			await setActive({ session: completeSignUp.createdSessionId });
			setSpinnerVisible(false);
		} catch (err) {
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
