const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('node:path');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');

const environment = process.env.NODE_ENV;
const isProduction = environment === 'production';

module.exports = () => ({
    mode: isProduction ? 'production' : 'development',
    entry: {
        app: './src/js/entry.jsx',
    },
    output: {
        path: path.join(__dirname, '/public'),
        filename: isProduction ? 'assets/js/[name]-[contenthash].js' : 'assets/js/[name].js',
        publicPath: '/',
    },
    resolve: {
        modules: [
            path.join(__dirname, '/node_modules'),
            path.join(__dirname, '/src'),
        ],
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    devServer: {
        open: true,
        watchFiles: ['src/**/*'],
    },
    performance: {
        hints: isProduction ? 'warning' : false,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: isProduction ? 'assets/css/[name]-[contenthash].css' : 'assets/css/[name].css',
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            inject: false,
            minify: false,
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            maximumFileSizeToCacheInBytes: isProduction ? 2097152 : 1024 * 1024 * 10,
        }),
        new webpack.DefinePlugin({
            // For now, skip service worker usage in development
            REGISTER_SERVICE_WORKER: JSON.stringify(true),
        }),
    ],
});
