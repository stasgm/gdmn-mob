// development config
// const fs = require('fs');
// const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');
const { server } = require('../dev.json');

require('dotenv').config({ path: './.env' });

module.exports = merge(commonConfig, {
  mode: 'development',

  entry: [
    'react-hot-loader/patch', // activate HMR for React
    `webpack-dev-server/client?${server.protocol}${server.name}:${server.port}`, // bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
    './index.tsx', // the entry point of our app
  ],
  output: {
    publicPath: '/',
  },
  devServer: {
    host: server.name,
    port: server.port,
    open: true,
    static: './',
    historyApiFallback: true,
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  // devtool: 'cheap-module-source-map',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.DefinePlugin({
      'process.env': {
        MOCK: JSON.stringify(process.env.MOCK),
      },
    }),
  ],
});
