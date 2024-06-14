import React, { useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { PropertyCard } from './PropertyCard';

export const BottomListingCard: React.FC<any> = ({ item, onClose }) => {
	const [isOpen, setIsOpen] = useState(true);
	const bottomSheetRef = useRef<BottomSheet>(null);

	const handleClosePress = () => {
		setIsOpen(false);
		if (onClose) onClose();
	};

	// snap points value needs to match bottom card container height in Map.tsx
	return (
		<BottomSheet
			ref={bottomSheetRef}
			onClose={handleClosePress}
			enablePanDownToClose={true}
			snapPoints={[400]}
			index={isOpen ? 0 : -1}
		>
			<PropertyCard mode={'contained'} backgroundColor={'white'} canOpen={true} listing={item} />
		</BottomSheet>
	);
};
