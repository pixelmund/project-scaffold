module.exports = {
	darkMode: 'class',
	experimental: 'all',
	purge: {
		content: ['./src/**/*.tsx', './src/**/*.ts'],
	},
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/forms'),
	],
};
