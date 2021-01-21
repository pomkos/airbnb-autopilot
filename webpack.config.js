const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
    bg: './src/misc/bg.js',
    loader: './src/loader.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'chrome/icons', to: 'icons' },
        { from: 'chrome/manifest.json', to: 'manifest.json' },
      ]
    })
  ],
  output: {
    chunkLoading: false,
    wasmLoading: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
