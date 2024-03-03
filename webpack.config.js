import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlBundlerPlugin from 'html-bundler-webpack-plugin';
import webpack from 'webpack';
import WorkboxPlugin from 'workbox-webpack-plugin';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const environment = process.env.NODE_ENV;
const isProduction = environment === 'production';

export default () => {
    const config = {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'source-map' : 'eval',
        output: {
            path: path.join(__dirname, '/public'),
            publicPath: '/',
        },
        resolve: {
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
                    404: 'src/404.html',
                },
                js: {
                    filename: 'assets/js/app-[contenthash].js',
                },
                css: {
                    filename: 'assets/css/[name]-[contenthash].css',
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

                // Exclude index.html from precaching
                exclude: [/index\.html$/],

                // Always use latest version of index.html, if available
                runtimeCaching: [{
                    urlPattern: /index\.html$/,
                    handler: 'NetworkFirst',
                }],
            }),
        );
    }

    return config;
};
