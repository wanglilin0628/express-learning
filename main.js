const cluster = require('cluster')

function startWorker() {
    let worker = cluster.fork()
    console.log('CLUSTER: Worker %d started', worker.id)
}
if (cluster.isMaster) {
    require('os').cpus().forEach(function() {
        startWorker()
    })
    // 记录所有断开的工作线程
    cluster.on('exit', (worker, code, signal) => {
        console.log('CLUSTER: Worker %d died with exit code %d (%s)',
                   worker.id, code, signal)
        startWorker()
    })
} else {
    // 在这个工作线程上启动我们的应用服务器
    require('./env.js')()
}