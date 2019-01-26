const { addBeforeLoader, loaderByName } = require('@craco/craco');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = {
    webpack: {
        configure(config, { env, paths }) {

            const purescriptLoader = {
                test: /\.purs$/,
                loader: require.resolve('purs-loader'),
                exclude: /node_modules/,
                query: {
                    psc: 'psa',
                    pscIde: true,
                    src: [
                        'src/**/*.purs',
                    ],
                    pscPackage: true,
                }
            };

            addBeforeLoader(config, loaderByName('file-loader'), purescriptLoader);

            // create-react-app disallows us to import files outside ./src folder.
            // We need to turn this rule off to import files from ./bower_components
            // see: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/webpack.config.dev.js#L112-L119
            config.resolve.plugins = config.resolve.plugins
                .filter(plugin => !(plugin instanceof ModuleScopePlugin));

            return config;
        }
    }
}