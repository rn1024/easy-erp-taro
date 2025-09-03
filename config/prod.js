module.exports = {
  defineConstants: {
    'process.env.API_BASE_URL': JSON.stringify('https://erp.samuelcn.com/api/v1')
  },
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true
    }
  },
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    // webpackChain (chain, webpack) {
    //   /**
    //    * 如果 h5 端编译后体积过大，可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
    //    * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
    //    */
    //   chain.plugin('analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    // }
  }
} 