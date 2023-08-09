const path = require('node:path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');

const environment = process.env.NODE_ENV;
const isProduction = environment === 'production';

module.exports = () => {
    const config = {
        mode: isProduction ? 'production' : 'development',
        output: {
            path: path.join(__dirname, '/public'),
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
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        devServer: {
            open: true,
            headers: {
                'Cache-Control': 'no-store',
            },
            watchFiles: ['src/**/*'],
        },
        performance: {
            hints: isProduction ? 'warning' : false,
        },
        plugins: [
            new webpack.DefinePlugin({
                REGISTER_SERVICE_WORKER: JSON.stringify(isProduction),
            }),
            new HtmlBundlerPlugin({
                extractComments: true,
                entry: {
                    index: 'src/index.html',
                },
                js: {
                    filename: isProduction ? 'assets/js/app-[contenthash].js' : 'assets/js/app.js',
                },
                css: {
                    filename: isProduction ? 'assets/css/[name]-[contenthash].css' : 'assets/css/[name].css',
                },
            }),
        ],
    };

    if (isProduction) {
        config.plugins.push(
            new WorkboxPlugin.GenerateSW({
                clientsClaim: true,
                skipWaiting: true,
                maximumFileSizeToCacheInBytes: isProduction ? 2097152 : 1024 * 1024 * 10,
            }),
        );
    }

    return config;
};
