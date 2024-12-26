// Purpose: Redirect all requests to /api/* to the backend server
module.exports = {
	async rewrites() {
		return [
			{
				source: '/api/stops',
				destination: 'http://127.0.0.1:6543/api/stops', // Proxy to Backend
			},
		];
	},
};
