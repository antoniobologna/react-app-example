const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const devPort = 3000;

module.exports = {
  entry: [
    './src/index.jsx'
  ],
  output: {
    library: "ReactApp",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
    filename: '[hash].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        //use: [ "babel-loader", 'eslint-loader' ],
        use: [ "babel-loader" ],
        exclude: [
          path.resolve(__dirname, "node_modules")
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
          {
            loader: "sass-loader?sourceMap",
            options: {
              includePaths: [
                path.resolve(__dirname, 'node_modules'),
                path.resolve(__dirname, 'src', 'style'),
              ]
            }
          },
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'url-loader?limit=10000',
          'img-loader'
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/i,
        use: [
          'file-loader?name=public/fonts/[name].[ext]'
        ]
      }
    ]
  },
  resolve: {
    unsafeCache: true,
    modules: ['./src', 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.html', '.scss', '.css']
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    })
  ],
  devtool: '#cheap-module-source-map',
  devServer: {
    host: "127.0.0.1",
    watchContentBase: true,
    port: devPort,
    historyApiFallback: true,
    index: 'index.html',
    inline: true,
    contentBase: './dist',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
};
