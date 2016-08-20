var path = require("path");
module.exports = {
    entry: {
        jFactory: "./index"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        library: "[name]"
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
};
