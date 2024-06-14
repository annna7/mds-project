import { theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

type MenuIconProps = {
	iconName: string,
	onPress: any,
};

export const MenuIcon: React.FC<MenuIconProps> = ({ iconName, onPress }) => {
	return (
		<Pressable
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			onPress={onPress}
		>
			<View style={styles.container}>
				<View
					style={styles.iconContainer}>
					<Icon name={ iconName } size={25} color={'white'}/>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconContainer: {
		width: 40,
		height: 40,
		backgroundColor: theme.colors.primary,
		borderRadius: 20,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
});