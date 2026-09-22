import path from 'node:path';
import HtmlBundlerPlugin from 'html-bundler-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';

const { dirname } = import.meta;
const isProduction = process.env.NODE_ENV === 'production';

export default {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval',
    output: {
        path: path.join(dirname, 'public'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
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
        client: {
            overlay: {
                warnings: false,
            },
        },
        headers: {
            'Cache-Control': 'no-store',
        },
        watchFiles: ['src/**/*'],
    },
    plugins: [
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
        isProduction && new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,

            // Exclude index.html from precaching
            exclude: [/index\.html$/],

            // Always use the latest version of index.html, if available
            runtimeCaching: [{
                urlPattern: /index\.html$/,
                handler: 'NetworkFirst',
            }],
        }),
    ],
};
