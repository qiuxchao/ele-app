module.exports = {
    // publicPath: '/wxzf/dist/',  // 打包文件的相对路径
    devServer: {
        open: true,     // 自动打开
        // host: "localhost",   // Network 地址
        port: 8080, // 端口号
        https: false,   // 是否开启 https
        hotOnly: false, 
        proxy: {
            // 配置跨域
            "/api": {
                // 设置接口根路径，这样就可以在组件中以 ‘/ ’的形式请求接口
                target: "https://ele-interface.herokuapp.com/api/",
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    }
}