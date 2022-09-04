const { merge } = require('webpack-merge');
const baseConf = require('./webpack.base');


module.exports = merge(baseConf('development'), {/* 开发 */
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        port: "3001",
        open: true,
        hot: true
    }
});