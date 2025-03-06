import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_BASE_URL, RETRY_DELAY } from '../constants/config';


const useMtaData = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkDatabaseConnection = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/stops`);
				return response.status === 200;
			} catch (error) {
				console.error('Error checking database connection:', error);
				return false;
			}
		};

		const fetchData = async () => {
			let isConnected = false;

			while (!isConnected) {
				isConnected = await checkDatabaseConnection();
				if (!isConnected) {
					await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				}
			}

			try {
				const response = await axios.get(`${API_BASE_URL}/stops`);
				setData(response.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return { data, loading };
};

export default useMtaData;
