import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ItemList } from './ItemList';
import { useSearchContext } from '../contexts/SearchContext';
import { useCustomFonts } from '../hooks/useCustomFonts';

export const BottomBar = () => {
	const customFont = useCustomFonts();
	const { state } = useSearchContext();
	const bottomSheetRef = useRef<BottomSheet>(null);

	return (
		<BottomSheet
			index={0}
			ref={bottomSheetRef}
			snapPoints={[75, '100%']}
		>
			<BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{
						fontWeight: 'bold',
						fontSize: 18,
					}}> {state.searchType === 'listings' ? state.listings.length : state.reviews.length} results </Text>
					<View style={ { height: 50 }} ></View>
				</View>
				<ItemList/>
			</BottomSheetScrollView>
		</BottomSheet>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {}
});

