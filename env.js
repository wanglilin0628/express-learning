const app = require('express')()
const http = require('http')

function startServer() {
  app.set('port', Math.floor(Math.random()*10) + 8000)
  app.use(function(req, res, next){
    var cluster = require('cluster');
    if(cluster.isWorker) console.log('Worker %d received request',
    cluster.worker.id);
    next()
  })
  http.createServer(app).listen(app.get('port'), function(){
      console.log( 'Express started in ' + app.get('env') +
                  ' mode on http://localhost:' + app.get('port') +
                  '; press Ctrl-C to terminate.' )
  })
}
if (require.main === module) {
  // 应用程序直接运行, 启动应用服务器
  startServer()
} else {
  // 应用程序作为一个模块通过'require'引入: 导出函数
  // 创建服务器
  module.exports = startServer
}