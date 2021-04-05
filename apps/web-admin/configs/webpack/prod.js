// production config
const { merge } = require('webpack-merge');
const { getRootRelativePath } = require('./utils');
const config = require('../config.json');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.tsx',
  output: {
    path: getRootRelativePath(config.webpack.buildPath),
    filename: 'js/bundle.[contenthash].min.js',
    publicPath: '/',
  },
  devtool: 'source-map',
  plugins: [],
});
