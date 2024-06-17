import * as SecureStore from 'expo-secure-store';

export const tokenCache = {
	async getToken(key: string) {
		try {
			return await SecureStore.getItemAsync(key);
		} catch (err) {
			return null;
		}
	},
	async saveToken(key: string, value: string) {
		try {
			await SecureStore.setItemAsync(key, value);
		} catch (err) {
			console.error(err);
		}
	}
};
