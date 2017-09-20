const { resolve } = require('path');
const {
	readFile,
	writeFile,
	mkdirSync,
	unlinkSync,
	readdirSync,
	lstatSync
} = require('fs');
const webpack = require('webpack');

const config = require('./webpack.config.base');

const ASSETS_DIR = resolve(__dirname, 'assets')
clearAssetsDir();

config.output = {
	path: config.output.path,

	// required for chunks to be loaded from `/assets/` dir correctly
	publicPath: '/assets/',
	
	// fingerprinting
	filename: '[name].[chunkhash].js',
	chunkFilename: '[name].[chunkhash].js'
};



// add build plugins
[].push.apply(config.plugins, [
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		filename: 'vendor.[chunkhash].js',
	 	minChunks: ({ resource }) => /node_modules/.test(resource),
	}),

	// retains hashnames for unmodified chunks 
	new webpack.HashedModuleIdsPlugin(),

	// define env variables
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production'),
		},
	}),
]);


// build
webpack(config, (err, stats) => {
	if (err){
		throw new Error('Error building bundle', err)
	}
	console.log(`Successfully built bundle in "${config.output.path}"`);

	// handle errors + warnings
	const info = stats.toJson();
	const br = '----------------------';
	if (stats.hasErrors()) {
		console.error(`${br}\n`, info.errors, `\n${br}`);
	}
	if (stats.hasWarnings()) {
		console.error(`${br}\n`, info.warnings, `\n${br}`);
	}

	// log stats
	console.log(`${br}\n`, stats.toString({
		chunks: true,
		colors: true,
		modules: false,
		chunkModules: false
	}))

	copyHTML();
})

function clearAssetsDir(){
	try {
		if (lstatSync(ASSETS_DIR)){
			// remove everything in ./assets
			console.log(`Removing everything in "${ASSETS_DIR}"...`)
			readdirSync(ASSETS_DIR)
				.forEach(filename => {
					const filepath = resolve(ASSETS_DIR, filename)
					unlinkSync(filepath)
				})
		}
	} catch (err){
		mkdirSync(ASSETS_DIR);
	}
}
function copyHTML(){
	// TODO - instead of this ghetto shit, use manifest-plugin
	// https://github.com/danethurber/webpack-manifest-plugin
	// https://github.com/soundcloud/chunk-manifest-webpack-plugin

	const bundleHashRegex = new RegExp(/^bundle\.([A-z0-9]+)\.js$/i)
	const bundleName = readdirSync(ASSETS_DIR).find(filename => bundleHashRegex.test(filename) )
	const bundleHash = bundleName.match(bundleHashRegex)[1];

	const cssHashRegex = new RegExp(/^main\.([A-z0-9]+)\.css$/i)
	const cssName = readdirSync(ASSETS_DIR).find(filename => cssHashRegex.test(filename) )
	let cssHash;
	if (cssName){
		cssHash = cssName.match(cssHashRegex)[1];
	}

	// add `vendor.js` to html
	const vendorRegex = new RegExp(/^vendor\.([A-z0-9]+)\.js$/i)
	const vendorName = readdirSync(ASSETS_DIR).find(filename => vendorRegex.test(filename) )

	// copy `index.html` to /dist
	const HTML_ENTRY = resolve(__dirname, 'index.html');
	const HTML_OUTPUT = resolve('./assets', 'index.html');
	readFile(HTML_ENTRY, 'utf8', function(err, html) {
		if (err) {
			return console.log(err);
		}
		let result = html.replace(/<!-- BUILD CONTENT([\s\S]*?)-->/g, '$1'); // uncomment css
		result = result.replace(/bundle\.js/i, `bundle.${bundleHash}.js`) // update js hash
		if (cssHash){
			result = result.replace(/main.css/i, `main.${cssHash}.css`)// update css hash
		}
		if (vendorName){
			result = result.replace(
				/<!-- VENDOR -->/,
				`<script defer src="/assets/${vendorName}"></script>`
			)
		}

		writeFile(HTML_OUTPUT, result, 'utf8', function (err) {
			if (err){
				return console.log(err)
			};
		});
	});
}
