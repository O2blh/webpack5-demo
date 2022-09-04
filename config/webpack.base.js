const path = require('path')
const os = require('os')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: './public/index.html'
})
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const threads = os.cpus().length // cpu线程数

function getStyleLoader(env, pre) {
    return [
        env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-preset-env'
                    ]
                }
            }
        },
        pre
    ].filter(Boolean)
}

const baseConf = (env) => {
    console.log('env', env)
    const plugins = [
        htmlWebpackPlugin,
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src'),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslingCache"),
            threads
        }),
    ]
    if (env === 'production') {
        plugins.push(new MiniCssExtractPlugin({
            filename: 'static/css/main.[hash:8].css'
        }))
    }

    return {
        entry: './src/index',
        module: {
            rules: [
                {
                    oneOf: [
                        {
                            test: /\.css$/,
                            use: getStyleLoader(env),
                        },
                        {
                            test: /\.less$/,
                            use: getStyleLoader(env, 'less-loader')
                        },
                        {
                            test: /\.s(a|c)ss$/,
                            use: getStyleLoader(env, 'sass-loader')
                        },
                        {
                            test: /\.styl$/,
                            use: getStyleLoader(env, 'stylus-loader')
                        },
                        {
                            test: /\.(png|jpe?g|gif|webp)$/,
                            type: 'asset',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: 10 * 1024
                                }
                            },
                            generator: {
                                filename: 'static/images/[hash:10][ext]'
                            }
                        },
                        {
                            test: /\.(ttf|mp3|mp4|avi)$/,
                            type: 'asset/resource',
                            generator: {
                                filename: 'static/media/[hash:10][ext]'
                            }
                        },
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            use: [
                                {
                                    loader: 'thread-loader',
                                    options: {
                                        workers: threads,
                                    }
                                },
                                {
                                    loader: 'babel-loader',
                                    options: {
                                        cacheDirectory: true, // 开启babel缓存
                                        cacheCompression: false, // 关闭缓存文件压缩
                                        plugins: ['@babel/plugin-transform-runtime']
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        plugins,
    }
}

module.exports = baseConf
