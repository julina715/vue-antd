const path = require('path'); // webpack依赖包，无需单独下载
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const os = require('os'); // webpack-uglify-parallel依赖包，无需单独下载
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 读取同一目录下的 base config
module.exports = env => {
    const config = require('./webpack.base.config')(env);
    config.output.path = path.resolve(__dirname, '../public/assets/dist/'); // 打包后的静态资源的存放路径
    config.output.publicPath = '/assets/dist/'; // 打包后的静态资源的请求路径
    config.plugins = [
        ...config.plugins,
        // 模块提升，减小体积
        new webpack.optimize.ModuleConcatenationPlugin(),
        // 因为chunks命名都是chunkhash相关，因此需要先清空dist
        new CleanWebpackPlugin(['dist/'], {
            root: path.resolve(__dirname, '../public/assets')
        }),
        new HtmlWebpackPlugin({
            template: '../resources/views/home_dev.blade.php',
            filename: path.resolve(__dirname, '../resources/views/home.blade.php')
        })
    ];
    if (env.bundle === 'true') {
        config.plugins.push(new BundleAnalyzerPlugin());
    }
    // 压缩js
    if (env.min === 'true') {
        config.plugins.push(
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    ie8: false,
                    output: {
                        comments: false,
                        beautify: false
                    },
                    compress: {
                        drop_console: true
                    },
                    warnings: false
                }
            })
        );
    }
    return config;
};
