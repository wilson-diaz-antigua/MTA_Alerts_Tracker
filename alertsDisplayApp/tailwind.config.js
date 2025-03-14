/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			screens: {
				'iphone-14pro-max': '430px', // Define custom screen size
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				transparent: 'transparent',
				current: 'currentColor',
				MTAred: '#EE352E',
				MTAgreen: '#00933C',
				MTAmagenta: '#B933AD',
				MTAblue: '#0039A6',
				MTAorange: '#ED8B00',
			},
		},
	},
	plugins: [],
};
