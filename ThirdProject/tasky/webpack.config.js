var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

const runOnBrowser = false;

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;;
  });

module.exports = {
  externals: runOnBrowser ? [] : nodeModules, // no need of externals to run on the browser
  entry: [
    './src/index.js'
  ],
  target: runOnBrowser ? 'web' : 'node', // if web it runs on the browser
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    port: 4172
  }
};
