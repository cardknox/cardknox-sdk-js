const config = require('./webpack.config');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

config.plugins.push(
    new CleanWebpackPlugin(),
    new CopyPlugin({
        patterns: [
            { from: 'dist', to: '../public/scripts' },
        ],
    })
);

config.mode = 'development';

module.exports = config;
