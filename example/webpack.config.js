var path = require('path')
var webpack = require('webpack');

module.exports = {
  entry: './boot.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    filename: 'app.js'
  },
  resolve: {
    'alias': {
      'vaf': path.resolve(__dirname, '../'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [
          /node_modules/,
          /vaf/,
        ]
      },
    ]
  },
  devServer: {
    publicPath: '',
  },
  devtool: '#inline-source-map',
}
