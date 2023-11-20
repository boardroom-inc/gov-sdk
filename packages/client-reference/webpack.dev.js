const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
  },
  entry: ['./index.tsx'],
  context: resolve(__dirname, './src'),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      buffer: require.resolve('buffer/'),
      crypto: false,
      stream: false,
      path: require.resolve('path-browserify'),
      fs: false,
      os: require.resolve("os-browserify/browser"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          happyPackMode: true,
          transpileOnly: true,
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ template: './index.html' }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      'process.env.ALCHEMY_MAINNET_KEY': JSON.stringify(process.env.ALCHEMY_MAINNET_KEY),
      'process.env.ALCHEMY_OPTIMISM_KEY': JSON.stringify(process.env.ALCHEMY_OPTIMISM_KEY),
      'process.env.ALCHEMY_ARBITRUM_KEY': JSON.stringify(process.env.ALCHEMY_ARBITRUM_KEY),
      'process.env.ALCHEMY_GOERLI_KEY': JSON.stringify(process.env.ALCHEMY_GOERLI_KEY),
      'process.env.BOARDROOM_API_KEY': JSON.stringify(process.env.BOARDROOM_API_KEY),
      'process.env.ETHERSCAN_MAINNET_API_KEY': JSON.stringify(process.env.ETHERSCAN_MAINNET_API_KEY),
      'process.env.ETHERSCAN_OPTIMISM_API_KEY': JSON.stringify(process.env.ETHERSCAN_OPTIMISM_API_KEY),
      'process.env.ETHERSCAN_GOERLI_API_KEY': JSON.stringify(process.env.ETHERSCAN_GOERLI_API_KEY),
      'process.env.SNAPSHOT_API_KEY': JSON.stringify(process.env.SNAPSHOT_API_KEY),
    }),
  ],
  performance: {
    hints: false,
  },
};
