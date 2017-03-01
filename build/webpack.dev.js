'use strict';
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 有问题，需要参考http://blog.csdn.net/zhangchao19890805/article/details/53150882
const merge = require('deep-assign');
const webpack = require('webpack');
const options = require('./options');
const utils = require('./utils');
const base = require('./webpack.base.js');

const config = merge(base, {

    watch: true,
    devtool: '#eval-source-map',

    entry: [
        options.paths.resolve('src/index.js')
    ],

    output: {
        filename: 'bundle.js',
        path: options.paths.output.main
    },    

    devServer: {
        contentBase: options.paths.output.main,
        host: '127.0.0.1',
        port: 9090,
        historyApiFallback: true,
        noInfo: false
    },

    plugins: [
        new ExtractTextPlugin({
            filename: 'bundle.css'
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true
        })

        // Minify with dead-code elimination
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]    
});

// Fix /// <reference path="" />
config.resolve.modules.push(options.paths.resolve('node_modules'))

// First item in module.rules array is Vue
// config.module.rules[0].options.loaders = {
//     scss: 'vue-style-loader!css-loader!sass-loader'
// };

config.module.rules[0].options.loaders = {
    scss: ExtractTextPlugin.extract({
        use: 'css-loader!sass-loader',
        fallback: 'vue-style-loader'
    }),
    css: ExtractTextPlugin.extract({
        use: 'css-loader!sass-loader',
        fallback: 'vue-style-loader'
    })
}

config.module.rules.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
        use: 'css-loader',
        fallback: 'style-loader'
    })
});




module.exports = config;
