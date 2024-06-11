import { Text, TextProps, View } from 'react-native';
import React from 'react';
import { theme } from '../theme';


type DetailBoxProps = {
	content: string,
};

export const DetailBox: React.FC<DetailBoxProps> = ({ content }) => {
	return (
		<View style={styles.detailBox}>
			<Text style={styles.detailText}>{ content }</Text>
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
		marginBottom: 100
	},
	detailText: {
		textAlign: 'center',
		fontWeight: '200',
		color: 'white',
		fontSize: 16
	}
};