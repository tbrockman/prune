const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function override(config, env) {
	if (env === 'production') {
		// Disable chunking
		config.optimization.splitChunks = {
			cacheGroups: {
				default: false,
				vendors: false,
				// Merge all the CSS into one file
				styles: {
					name: 'styles',
					test: /\.(css|scss)$/,
					chunks: 'all',
					enforce: true,
				},
				// Merge all the JS into one file
				commons: {
					name: 'commons',
					chunks: 'all',
					minChunks: 1,
					enforce: true,
				},
			},
		};
		config.optimization.runtimeChunk = false;

		// Get rid of hash for js files
		config.output.filename = 'static/js/[name].js';
		config.output.chunkFilename = 'static/js/[name].chunk.js';

		// Get rid of hash for css files
		const miniCssExtractPlugin = config.plugins.find(
			(element) => element.constructor.name === 'MiniCssExtractPlugin',
		);
		miniCssExtractPlugin.options.filename = 'static/css/[name].css';
		miniCssExtractPlugin.options.chunkFilename =
			'static/css/[name].chunk.css';
		miniCssExtractPlugin.options.ignoreOrder = true;

		// Remove hash filenames for media files
		const mediaRule = config.module.rules
			.find((rule) => rule.oneOf)
			.oneOf.find(
				(rule) =>
					rule.test &&
					rule.test
						.toString()
						.includes('svg|gif|png|jpe?g|webp|avif'),
			);

		if (mediaRule) {
			mediaRule.options.name = 'static/media/[name].[ext]';
		}
	}

	return config;
};
