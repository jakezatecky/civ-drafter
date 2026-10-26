import path from 'node:path';

const { dirname } = import.meta;

export default {
    mode: 'development',
    entry: {
        index: path.join(dirname, 'test/index.ts'),
    },
    output: {
        path: path.join(dirname, 'test-compiled'),
    },
    module: {
        parser: {
            javascript: {
                dynamicImportMode: 'eager',
            },
        },
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
};
