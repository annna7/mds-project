import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../theme';

export type ButtonProps = {
	mode?: string,
	style?: any,
	width?: string | number,
	children: React.ReactNode,
} & React.ComponentProps<typeof PaperButton>;

const Button = ({ mode, style, width, children, ...props }: ButtonProps) => {
	width = width || '100%';
	return (
		<PaperButton
			style={[
				{ width },
				styles.button,
				mode === 'outlined' && { backgroundColor: theme.colors.surface },
				style
			]}
			labelStyle={styles.text}
			mode={mode}
			{...props}
		>
			{children}
		</PaperButton>
	);
};

const styles = StyleSheet.create({
	button: {
		marginVertical: 15
	},
	text: {
		fontWeight: 'bold',
		fontSize: 15,
		lineHeight: 26
	}
});

export default memo(Button);
