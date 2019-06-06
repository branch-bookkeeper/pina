const shouldAnalyze = process.env.ANALYZE === 'yes';

module.exports = {
    webpack: {
        plugins: [
            ...(shouldAnalyze ? [new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)()] : []),
        ],
    },
};
