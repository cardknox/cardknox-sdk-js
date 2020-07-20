const path = require('path');


module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.min.js',
        libraryTarget: 'window'
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    "eslint-loader"
                ],
            }
        ]
    }
};