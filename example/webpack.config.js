var path = require('path');
var webpack = require('webpack');

var config = {
  context: __dirname
};

config.entry = [
  'babel-polyfill',
  path.join(__dirname, 'src', 'js', 'main.js')
];

config.module = {
  loaders: [
    {
      loader:  'babel-loader',
      test:    /\.jsx?$/,
      exclude: /node_modules/
    }
  ],
  postLoaders: []
};

config.output = {
  filename: '[name].bundle.js',
  chunkFilename: '[id].chunk.js',
  path: path.join(__dirname, 'static', 'js'),
  publicPath: '/static/js',
  devtoolModuleFilenameTemplate: '[resourcePath]',
  devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
};

config.plugins = [];

config.resolve = {
  extensions: [
    '',
    '.js',
    '.jsx'
  ],
  modulesDirectories: [
    './src/js',
    './node_modules/'
  ]
};

module.exports = config;
