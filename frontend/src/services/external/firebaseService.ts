import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

export const getFilePathForProfilePicture = (clerkId: string) => `profilePictures/${clerkId}`;

export const uploadProfilePicture = async (clerkId: string): Promise<string> => {
	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		quality: 1,
		allowsEditing: true,
	});

	if (result.canceled) {
		return '';
	}

	const uri = result.assets[0].uri;
	const blob = await fetch(uri).then((response) => response.blob());

	const filePath = getFilePathForProfilePicture(clerkId);
	const storageRef = ref(storage, filePath);

	try {
		await uploadBytes(storageRef, blob);
		return await getDownloadURL(storageRef);
	} catch (error) {
		console.error('Error uploading profile picture:', error);
		return '';
	}
};
