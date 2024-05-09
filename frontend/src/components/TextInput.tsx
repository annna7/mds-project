import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../theme';

type Props = React.ComponentProps<typeof Input> & { errorMessage?: string };

export const TextInput = ({ errorMessage, ...props }: Props) => (
	<View style={styles.container}>
		<Input
			style={styles.input}
			selectionColor={theme.colors.secondary}
			underlineColor="transparent"
			mode="outlined"
			{...props}
		/>
		{errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
	</View>
);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginVertical: 12
	},
	input: {
		backgroundColor: theme.colors.secondary
	},
	error: {
		fontSize: 14,
		color: theme.colors.error,
		paddingHorizontal: 4,
		paddingTop: 4
	}
});

export default memo(TextInput);
