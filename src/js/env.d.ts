// Globally define `process.env.NODE_ENV` (which Webpack replaces) so that TS can resolve it
declare const process: {
    env: {
        NODE_ENV: 'development' | 'production';
    };
};
