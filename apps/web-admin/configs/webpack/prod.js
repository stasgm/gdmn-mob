// production config
const { merge } = require('webpack-merge');
const { getRootRelativePath } = require('./utils');
const config = require('../config.json');
const webpack = require('webpack');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.tsx',
  output: {
    path: getRootRelativePath(config.webpack.buildPath),
    filename: 'js/bundle.[contenthash].min.js',
    publicPath: '/admin/',
  },
  devtool: 'source-map',
  plugins: [
   // new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
    new webpack.ProvidePlugin({process: 'process/browser', }),
  ],
});
