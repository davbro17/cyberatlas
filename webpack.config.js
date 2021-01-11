const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ThreadsPlugin = require('threads-plugin')
const path = require('path');
const modules = require('./src/engine/modules.json');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const config = {
	entry: {
		bundle: ['./src/main.js'],
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
				  {
					loader: MiniCssExtractPlugin.loader,
					options: { hmr: !prod }
				  },
				  'css-loader'
				]
			  },
			  {
					test: /\.worker\.js$/,
					use: { loader: 'worker-loader' },
			  }
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new ThreadsPlugin()
	],
	devtool: prod ? false: 'source-map',
	optimization: {
		runtimeChunk: 'single'
	}
};

// modules.forEach(mod => {
// 	config.entry[mod] = [`./src/modules/${mod}/main.js`];
// });

module.exports = config;