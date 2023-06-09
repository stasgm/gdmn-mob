// production config
const { merge } = require('webpack-merge');
const { getRootRelativePath } = require('./utils');
const config = require('../config.json');
const webpack = require('webpack');
const commonConfig = require('./common');

require('dotenv').config({ path: './.env' });

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.tsx',
  output: {
    path: getRootRelativePath(config.webpack.buildPath),
    filename: 'js/bundle.[contenthash].min.js',
    publicPath: '/',
    assetModuleFilename: 'assets/images/[name][ext]'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.ProvidePlugin({process: 'process/browser', }),
    new webpack.DefinePlugin({
      'process.env': {
        REACT_APP_SECRET_KEY: JSON.stringify(process.env.REACT_APP_SECRET_KEY),
        REACT_APP_SITE_KEY: JSON.stringify(process.env.REACT_APP_SITE_KEY),
      },
    }),
    ],
});
