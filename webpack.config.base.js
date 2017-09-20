const {resolve} = require('path');

const FILE_NAME = 'bundle.js';
const BUILD_PATH = resolve(__dirname, 'assets');

const config = {
	context: resolve(__dirname),
	
	entry: {
		bundle: 'src/index.js',
	},
	output: {
		filename: '[name].js',
		path: BUILD_PATH,
	},

	module: {
		rules: [
			{
				test: /\.js(x?)$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						// options specified in `.babelrc`
						options: {}
					}
				]
			}
		]
	},

	plugins: [],

	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			src: resolve(__dirname, 'src'),
			components: 'src/components',
		}
	},
};

module.exports = config;
