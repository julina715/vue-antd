const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin'); // 检测循环依赖
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 将css代码合并为一个文件

module.exports = env => {
    process.env.NODE_ENV = env.NODE_ENV;
    const isProduction = env.NODE_ENV === 'production';
    return {
        entry: {
            app: ['./src/main.js']
        },
        output: {
            filename: isProduction ? '[name]_[chunkhash:5].js' : '[name].js',
            publicPath: '/',
            chunkFilename: isProduction ? '[name]_[chunkhash:5].js' : '[name].js'
        },
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: ['.ts', '.tsx', '.vue', '.js', '.json'],
            modules: [path.resolve(__dirname, 'node_modules')],
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            },
        },
        module: {
            rules: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                            // the "scss" and "sass" values for the lang attribute to the right configs here.
                            // other preprocessors should work out of the box, no loader config like this necessary.
                            'scss': [
                                'vue-style-loader',
                                'css-loader',
                                'sass-loader'
                            ],
                            'sass': [
                                'vue-style-loader',
                                'css-loader',
                                'sass-loader?indentedSyntax'
                            ]
                        }
                        // other vue-loader options go here
                    }
                },
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: true
                                }
                            },
                            {
                                loader: 'less-loader'
                            }
                        ]
                    })
                },
                {
                    test: /\.(png|svg|jpg|gif|woff2?|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name(file) {
                                    // 正式环境下混淆命名
                                    return isProduction ? '[sha512:hash:base64:8].[ext]' : '[path][name].[ext]';
                                }
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            // 剔除momentjs无用的语言包
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en-gb/),
            // 将共同的引用文件打包
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                minChunks: (module, count) =>
                    (module.context && module.context.indexOf('node_modules') !== -1) || count >= 2
            }),
            // // 将echarts单独打包
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'echarts',
            //     async: true,
            //     minChunks: (module, count) =>
            //         module.context && (module.context.indexOf('echarts') >= 0 || module.context.indexOf('zrender') >= 0)
            // }),
            // 将echarts单独打包
            new webpack.optimize.CommonsChunkPlugin({
                name: 'chartjs',
                async: true,
                minChunks: (module, count) => module.context && module.context.indexOf('chart.js') >= 0
            }),
            // 将父chunk和子chunk相同的部分打包，并异步加载
            new webpack.optimize.CommonsChunkPlugin({
                children: true, // 检测子chunk
                async: true, // 异步
                minChunks: 3 // 最小共同chunks数为3
            }),
            // 打包css
            new ExtractTextPlugin({
                filename: isProduction ? '[name]_[contenthash:5].css' : '[name].css',
                allChunks: true // 打包所有chunk的
            }),
            // 检查环形依赖
            new CircularDependencyPlugin({
                exclude: /a\.js|node_modules/,
                // add errors to webpack instead of warnings
                failOnError: true
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(env.NODE_ENV)
                }
            })
        ]
    };
};
