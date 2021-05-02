// shared config (dev and prod)
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('../../package.json');
const config = require('../config.json');
const { getRootRelativePath } = require('./utils');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  context: getRootRelativePath('src'),
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]',
          'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: getRootRelativePath('assets/favicon.ico'),
      template: 'index.html.ejs',
      title: pkg.displayName,
      /* template params */
      appMountNodeId: config.webpack.appMountNodeId,
      description: pkg.description,
      mobile: true,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      nodeModules: false,
    }),
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  performance: {
    hints: false,
  },
};
