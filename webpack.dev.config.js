const config = require('./webpack.config');

const CopyPlugin = require('copy-webpack-plugin');

config.plugins.push(
    new CopyPlugin({
        patterns: [
            { from: 'dist', to: '../public/scripts' },
        ],
    })
);

config.mode = 'development';

module.exports = config;
