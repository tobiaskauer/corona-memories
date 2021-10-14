module.exports = {
  publicPath: "/",
  //publicPath: "/coronamemories/",
  devServer:  {
    host: 'localhost',
    /*proxy: {
      '^/api': {
        target: 'https://coroname.uber.space',
        changeOrigin: true,
        pathRewrite: { "^/api/": "/" },
        logLevel: 'debug' // this what you want
      }
    },*/
    publicPath: '/',  
  }
}
