
import React from 'react';
import { TextInput } from '../components';
import { useSignIn } from '@clerk/clerk-expo';
import Background from '../components/Background';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { Formik } from 'formik';
import * as Yup from 'yup';

const signInValidationSchema = Yup.object().shape({
	emailAddress: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string().required('Password is required'),
});

export default function SignInScreen() {
	const { signIn, setActive, isLoaded } = useSignIn();


	return (
		<Background>
			<Logo />
			<Formik
				initialValues={{ emailAddress: '', password: '' }}
				validationSchema={signInValidationSchema}
				onSubmit={async (values) => {
					if (!isLoaded) return;

					try {
						const completeSignIn = await signIn.create({
							identifier: values.emailAddress,
							password: values.password,
						});
						await setActive({ session: completeSignIn.createdSessionId });
					} catch (err) {
						console.error(err);
					}
				}}
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
							errorText={touched.emailAddress && errors.emailAddress ? errors.emailAddress : undefined}

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
							errorText= {errors.password as string}
						/>

						<Button mode="contained" onPress={() => handleSubmit()}>
							Sign In
						</Button>
					</>
				)}
			</Formik>
		</Background>
	);
}
