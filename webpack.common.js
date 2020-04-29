/* eslint-disable import/no-extraneous-dependencies */
// const path = require('path');
const webpack = require('webpack');


const vendorSettings = {
  $: 'jquery',
  d3: 'd3',
};

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/index.js'],
    // vendor: ['jquery', 'd3'],
  },
  plugins: [
    new webpack.ProvidePlugin(vendorSettings),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images',
        },
      },
    ],
  },
};
