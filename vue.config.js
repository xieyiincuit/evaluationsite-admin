const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: './', // 部署应用包时的基本 url
    outputDir: 'dist', // build 构建文件目录
    assetsDir: 'static', // 静态资源目录
    transpileDependencies: true,
    devServer: {
        host: 'localhost',
        port: 4000,
    },
    configureWebpack(config) {
        // production configuration Gzip compression
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(
                new CompressionWebpackPlugin({
                    // 正则匹配需要压缩的文件后缀
                    // test: /\.(js|css|svg|woff|ttf|json|html)$/,
                    test: /\.(js|css|json|html)$/,
                    // 大于10kb的会压缩
                    threshold: 10240,
                    // 是否删除原文件
                    deleteOriginalAssets: false
                })
            )
            Object.assign(config, {
                resolve: {
                    alias: {
                        '@': resolve('src')
                    }
                },
                externals: {
                    'vue': 'Vue',
                    'vue-router': 'VueRouter',
                    'vuex': 'Vuex',
                    'axios': 'axios'
                }
            })
        }
    },
}
