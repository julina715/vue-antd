const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// 读取同一目录下的 base config
module.exports = env => {
    const config = require('./webpack.base.config')(env);
    config.devtool = 'eval-source-map';
    config.output.path = path.resolve(__dirname, 'build/');
    config.plugins = [
        ...config.plugins,
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: path.resolve(__dirname, 'build/index.html')
        }),
        // 通过缓存加速打包
        new HardSourceWebpackPlugin({
            cacheDirectory: path.resolve(__dirname, '.cache/hard-source/[confighash]'),
            configHash: function() {
                return env.NODE_ENV;
            },
            environmentHash: {
                root: process.cwd(),
                directories: [],
                files: [
                    'package-lock.json',
                    'yarn.lock',
                    'theme.js',
                    'webpack.base.config.js',
                    'webpack.build.config.js'
                ]
            }
        })
    ];
    return config;
};
