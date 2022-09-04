const { merge } = require('webpack-merge');
const path = require('path')
const os = require('os')
const baseConf = require('./webpack.base');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin')

const threads = os.cpus().length // cpu线程数

module.exports = merge(baseConf('production'), {/* 生产配置 */
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.[hash:8].js',
        clean: true
    },
    plugins: [
        new CssMinimizerPlugin(),
    ],
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                parallel: threads
            }),
            new ImageMinimizerWebpackPlugin({
                minimizer: {
                    implementation: ImageMinimizerWebpackPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        'preset-default',
                                        'prefixIds',
                                        {
                                            name: 'sortAttrs',
                                            params: {
                                                xmlnsOrder: 'alphabetical'
                                            }
                                        }
                                    ]
                                },
                            ],
                        ]
                    }
                }
            })
        ]
    }
});