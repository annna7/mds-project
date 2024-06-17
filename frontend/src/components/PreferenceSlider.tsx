import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { HeaderText } from './HeaderText';
import { theme } from '../theme';

interface PreferenceSliderProps {
	question: string;
	leftText: string;
	rightText: string;
	onValueChange?: (value: number) => void;
}

export const PreferenceSlider: React.FC<PreferenceSliderProps> = ({ question, leftText, rightText, onValueChange }) => {
	const [value, setValue] = useState(3);
	const min = useSharedValue(1);
	const max = useSharedValue(5);
	const progress = useSharedValue(3);

	const width = Dimensions.get('window').width;

	return (
		<View style={[styles.sliderContainer, { width: width * 0.7 }]}>
			<HeaderText size={18}>{question}</HeaderText>
			<Slider
				minimumValue={min}
				maximumValue={max}
				step={4}
				theme={{
					maximumTrackTintColor: theme.colors.secondary,
					minimumTrackTintColor: theme.colors.primary,
					bubbleBackgroundColor: theme.colors.primary,
				}}
				progress={progress}
				style={styles.slider}
			/>
			<View style={styles.labels}>
				<Text style={[styles.label, styles.leftText]}>{leftText}</Text>
				<Text style={[styles.label, styles.rightText]}>{rightText}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	slider: {
		marginVertical: 15,
	},
	leftText: {
		position: 'relative',
		left: 0
	},
	label: {
		fontFamily: 'ProximaNova-Bold',
		color: theme.colors.tertiary
	},
	rightText: {
		position: 'absolute',
		right: 0,
	},
	labels: {
		display: 'flex',
		flexDirection: 'row',
	},
	sliderContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignContent: 'center',
	}
});
