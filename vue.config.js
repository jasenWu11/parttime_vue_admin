module.exports = {
    baseUrl: '/',
		publicPath: '/',
    assetsDir: 'static',
    productionSourceMap: false,
		 devServer: {
			host: '0.0.0.0',
			port: 8091,
			// publicPath: '../',
			// 设置代理
			proxy: {
				"/api": {
					target: 
					// "http://192.168.163.195:8092/PartTime/", // 跨域访问
					//"http://192.168.1.102:8080/", // 跨域访问
					"http://192.168.1.102:8092/PartTime/",
					// "http://192.168.31.114:8092/PartTime/",
					// target: " ", // 跨域访问
					ws: true, // 是否启用websockets
					changOrigin: true, //开启代理
					secure: false, // 将安全设置为false,才能访问https开头的
			pathRewrite: {
						'^/api': '/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
					}
				}
			}
		 },
}