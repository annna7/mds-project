import { Text, TextProps, View } from 'react-native';
import React, { ReactNode } from 'react';
import { theme } from '../theme';


type DetailBoxProps = {
	children: ReactNode,
};

export const DetailBox: React.FC<DetailBoxProps> = ({ children }) => {
	return (
		<View style={styles.detailBox}>
			<View style={styles.flexContent}>{ children }</View>
		</View>
	);
};

const styles = {
	detailBox: {
		backgroundColor: theme.colors.primary,
		borderRadius: 15,
		paddingVertical: 5,
		paddingHorizontal: 15,
		shadowColor: 'black',
		shadowOffset: { width: 10, height: 10 },
		shadowOpacity: 0.5,
		marginHorizontal: 10,
	},
	flexContent: {
		display: 'flex',
		flexDirection: 'row',
	}
};