const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const resolve = dir => path.join(__dirname, dir)
const IS_PROD = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: '/dist/', // 测试环境代理线上
  // publicPath: !IS_PROD ? './' : '/dist/', // 正式环境
  outputDir: 'dist', // 打包后文件
  assetsDir: 'static', // 静态资源文件
  indexPath: 'index.html',
  lintOnSave: false,
  filenameHashing: true,
  productionSourceMap: false,
  devServer: {
    host: '127.0.0.1',
    open: false,
    port: 8080,
    proxy: {
      '/dev-api': {
        target: `https://loginzwfw.mem.gov.cn:2443/uias/`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + '/dev-api']: ''
        }
      },
      // 国办单点登录代理地址
      '/api': {
        target: 'https://loginzwfw.mem.gov.cn:2443/uias/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  css: {
    extract: IS_PROD
      ? {
          ignoreOrder: true
        }
      : false
  },
  chainWebpack: config => {
    config.resolve.symlinks(true) // 修复HMR
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // 路径别名
    config.resolve.alias.set('@', resolve('src'))

    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()

    // 处理 svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end()

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
  },
  configureWebpack: {
    output: IS_PROD
      ? (() => {
          return {
            filename: `static/js/[name]_[chunkhash].js`,
            chunkFilename: `static/js/[id]_[chunkhash].js`
          }
        })()
      : {},
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })
      ],
      splitChunks: {
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          },
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c)ss$/,
            chunks: 'all',
            enforce: true
          },
          runtimeChunk: {
            name: 'manifest'
          }
        }
      }
    }
  }
}
