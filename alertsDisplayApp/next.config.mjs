/** @type {import('next').NextConfig} */
const nextConfig = {
	rewrites: async () => {
		return [
			{
				source: '/api/:path*',
				destination: 'http://127.0.0.1:6543/api/:path*',
			},
		];
	},
	reactStrictMode: true,
};

export default nextConfig;
