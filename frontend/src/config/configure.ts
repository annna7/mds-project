import { API_PORT, API_HOST, AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';
const apiHost = '10.0.2.2';
export const config = {
	api: {
		baseUrl: `http://${apiHost}:${API_PORT}`
	},
	auth0: {
		clientId: AUTH0_CLIENT_ID,
		domain: AUTH0_DOMAIN
	}
};

