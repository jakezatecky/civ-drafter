const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('node:path');

const environment = process.env.NODE_ENV;
const isProduction = environment === 'production';

module.exports = () => ({
    mode: isProduction ? 'production' : 'development',
    entry: {
        app: './src/js/entry.js',
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
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
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
    ],
});
