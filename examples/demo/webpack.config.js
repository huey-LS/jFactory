const path = require('path');

module.exports = {
  entry: [
    './index'
  ],
  output: {
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: path.join(__dirname, '../../'),
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
