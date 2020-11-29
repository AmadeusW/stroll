const copyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
    entry: './src/app/app.ts',
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'stroll.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, js, and jsx files.
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'ts-loader',
        }],
    },
    plugins: [
        new copyWebpackPlugin({
            patterns: [
                { from: "src/static", to: "."}
            ]
        })
    ]
};
