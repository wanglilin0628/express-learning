const http = require('http')
const path = require('path');
const fs = require('fs')


http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  var path = join(__dirname, "/src/static/movie/mov_bbb.mp4")
  res.end(`<h1>Hello World</h1>`);
}).listen(8080)


function serveStaticFile(res, path, contentType, responseCode) {
  if (!responseCode) {
    responseCode = 200;
    fs.readFile(__dirname + path, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('500 - Internal Error')
      } else {
        res.writeHead(responseCode, {'Content-Type': contentType})
        res.end(data)
      }
    })
  }
}

console.log('Server started on localhost:8080')