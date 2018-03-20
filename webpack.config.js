const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const MinifyPlugin = require('babel-minify-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const plugins = [];
const devMode = process.env.NODE_ENV === 'development';
const prodMode = process.env.NODE_ENV === 'production';

const PROXY_HOST = process.env.PROXY_HOST;
const PROXY_PORT = process.env.PROXY_PORT;

if (prodMode) {
    plugins.push(new MinifyPlugin());
}

if (devMode) {
    plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
    entry: ['babel-polyfill', './src/app/app.js'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js'
    },
    mode: process.env.NODE_ENV,
    devtool: devMode && 'inline-sourcemap',
    module: {
        rules: [
            // {
            //     enforce: 'pre',
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            //     options: {
            //         emitWarning: true,
            //         quiet: true,
            //     },
            // },
            {
                test: /\.js$/,
                loader: ['babel-loader'],
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[local]',
                        },
                    }, 'fast-sass-loader'],
                }),
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?modules&importLoaders=1&localIdentName=[local]'],
                }),
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loaders: ['url-loader', 'img-loader']
            },
            {
                test: /\.(svg|woff|woff2|eot|ttf|)$/i,
                loaders: ['url-loader']
            }
        ],
    },
    resolve: {
        symlinks: prodMode,
        extensions: ['.js', '.jsx', '.scss', '.css'],
        modules: ["node_modules"],
        alias: {
            i18n: path.resolve(__dirname, './src/i18n/'),
        },
    },
    plugins: [
        ...plugins,
        new CopyWebpackPlugin([
            'src/static/index.html',
        ]),
        new ExtractTextPlugin('styles.css', {
            allChunks: true,
        })
    ],
};
