const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  plugins: [new webpack.ProgressPlugin()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
}