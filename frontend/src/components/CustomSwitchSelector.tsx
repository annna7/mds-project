import SwitchSelector from 'react-native-switch-selector';
import { SearchTypeEnum } from '../enums';
import { theme } from '../theme';
import React from 'react';

export const CustomSwitchSelector: React.FC<any> = ({ options, mode, value, onPress, disabled, width }) => {
	const buttonColor = mode === 'green' ? theme.colors.inverseSurface : theme.colors.text;
	const borderColor = mode === 'green' ? theme.colors.text : theme.colors.secondary;
	const backgroundColor = mode === 'green' ? theme.colors.inversePrimary : '';
	return (
		<SwitchSelector
			options={options}
			buttonColor={disabled ? 'darkgray' : buttonColor}
			backgroundColor={disabled ? 'lightgray' : backgroundColor}
			borderColor={borderColor}
			disabled={disabled}
			animationDuration={150}
			borderWidth={10}
			height={50}
			touchableProps={{height:200}}
			initial={0}
			style={{
				width: width
			}}
			textContainerStyle={{height: '100%'}}
			value={options.map(entry => entry.value).indexOf(value)}
			onPress={onPress}
			bold={true}
		/>
	);
};
