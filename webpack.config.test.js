import path from 'node:path';

const { dirname } = import.meta;

export default {
    mode: 'development',
    entry: {
        index: path.join(dirname, 'test/index.js'),
    },
    output: {
        path: path.join(dirname, '/test-compiled'),
        publicPath: path.join(dirname, './public'),
    },
    resolve: {
        extensions: ['.js'],
    },
    module: {
        parser: {
            javascript: {
                dynamicImportMode: 'eager',
            },
        },
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
        ],
    },
};
