export const capitalize = (str: string | null): string => {
	if (!str) {
		return '';
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getShortenedString = (str: string, maxLen: number): string => {
	if (str.length < maxLen) {
		return str;
	}
	return str.slice(0, maxLen) + '...';
};