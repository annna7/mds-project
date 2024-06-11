import { callApi } from '../../utils';

export const reviewService = {
	createReview: (data: any, userId: string) => {
		return callApi('reviews', { method: 'POST', body: data }, userId);
	},

	getReview: (id: string, userId: string) => {
		return callApi(`reviews/${id}`, {}, userId);
	},

	updateReview: (id: string, data: any, userId: string) => {
		return callApi(`reviews/${id}`, { method: 'PUT', body: data }, userId);
	},

	deleteReview: (id: string, userId: string) => {
		return callApi(`reviews/${id}`, { method: 'DELETE' }, userId);
	}
};
