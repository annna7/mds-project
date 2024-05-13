// import React, { type ComponentProps } from 'react';
// import { type TextInput as BaseTextInput } from 'react-native-paper';
// import { View, StyleSheet, Text } from 'react-native';
// import { theme } from '../theme';
//
// type TextInputProps = ComponentProps<typeof BaseTextInput> & { error?: string };
//
// export const TextInput = ({ error, ...props }: TextInputProps) => {
//     return (
//         <View style={styles.container}>
//             <TextInput
//                 style={styles.input}
//                 selectionColor={theme.colors.primary}
//                 underlineColor="transparent"
//                 mode="outlined"
//                 {...props}
//             />
//             {error && <Text style={styles.error}>{error}</Text>}
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     input: {
//         height: 40,
//         margin: 12,
//         borderWidth: 1
//     },
//     error: {
//         color: theme.colors.error,
//         paddingHorizontal: 10,
//         paddingTop: 5
//     },
//     container: {
//         width: '100%',
//         marginVertical: 12
//     }
// });

import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../theme';

type Props = React.ComponentProps<typeof Input> & { errorText?: string };

export const TextInput = ({ errorText, ...props }: Props) => (
	<View style={styles.container}>
		<Input
			style={styles.input}
			selectionColor={theme.colors.secondary}
			underlineColor="transparent"
			mode="outlined"
			{...props}
		/>
		{errorText ? <Text style={styles.error}>{errorText}</Text> : null}
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
