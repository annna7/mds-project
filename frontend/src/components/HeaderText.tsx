import React from 'react';
import { Text, StyleSheet, TextProps, ColorValue } from 'react-native';
import { theme } from '../theme';
import { useCustomFonts } from '../hooks/useCustomFonts';
import { ActivityIndicator } from 'react-native-paper';


type HeaderTextProps = {
	children: React.ReactNode,
	size: number,
	paddingTop?: number,
	paddingBottom?: number,
	color?: ColorValue,
	textAlign?: 'center' | 'left' | 'right' | 'justify' | 'auto',
	marginTop?: number,
} & TextProps;

export const HeaderText = ({ children, color, size, paddingBottom, paddingTop, textAlign, marginTop, ...props }: HeaderTextProps) => {
	const customFonts = useCustomFonts();
	if (!customFonts) {
		return <ActivityIndicator size="large"/>;
	}

	color = color || theme.colors.text;
	paddingTop = paddingTop ? paddingTop : 15;
	textAlign = textAlign || 'center';


	return (
		<Text {...props} style={[styles.headerText, {
			textAlign: textAlign,
			paddingTop: paddingTop,
			color: color,
			fontSize: size,
			paddingBottom: paddingBottom,
			fontFamily: 'ProximaNova-Bold'
		}]}>
			{children}
		</Text>
	);
};

const styles = StyleSheet.create({
	headerText: {
		fontSize: 20,
		paddingHorizontal: 5,
	},
});
