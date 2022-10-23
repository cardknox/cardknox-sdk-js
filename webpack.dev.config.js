const config = require('./webpack.config');

const FileManagerPlugin = require('filemanager-webpack-plugin');

config.plugins.push(
    new FileManagerPlugin({
        events: {
            onEnd: {
              copy: [
                { source: 'dist', destination: 'public' },
              ]
            }
        }
    })
);

config.mode = 'development';

module.exports = config;
