import { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { API_HOST, API_PORT } from '@env';


const baseUrl = `http://${API_HOST}:${API_PORT}/api`;

export interface CallApiOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
	body?: any,
	headers?: { [key: string]: string },
}

export async function callApi(endpoint: string, options: CallApiOptions = {}, userId: string = ''): Promise<any> {
	const { method = 'GET', body = null, headers = {} } = options;

	const config: AxiosRequestConfig = {
		method,
		url: `${baseUrl}/${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		data: body,
	};

	if (userId && config.headers) {
		config.headers['X-Clerk-User-Id'] = userId;
	}

	config.data = body;

	console.log(`Calling API with config: ${JSON.stringify(config)}`);
	try {
		const response = await axios(config);
		console.log(`API call succeeded with response: ${JSON.stringify(response.data)}`);
		return response.data;
	} catch (error) {
		console.error(error);
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data.message || 'API call failed');
		} else {
			throw new Error('An unknown error occurred');
		}
	}
}
