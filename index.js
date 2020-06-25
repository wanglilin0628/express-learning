const express = require('express')
const app = express()

// 设置handlebars
const handlebars = require('express-handlebars').create({ defaultLayout:'main' })

let fortunes = [
  "AAA",
  "BBB",
  "CCC",
  "DDD"
]

app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.set('port', process.env.PORT || 8080)

app.use(express.static(__dirname + '/public'))

// 在404处理器之前加上两个新路由
app.get('/', (req, res) => {
  // res.type('text/plain')
  // res.send('Meadowlark Travel')
  res.render('home')
})

app.get('/about', (req, res) => {
  // res.type('text/plain')
  // res.send('About Meadowlark Travel')
  let randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]
  res.render('about', { fortune: randomFortune })
})


// 404 catch-all处理器 (中间件)
app.use((req, res, next) => {
  // res.type('text/plain')
  // res.status(404)
  // res.send('404 - Not Found')
  res.status(404)
  res.render('404')
})

// 定义500页面
app.use((err, req, res, next) => {
  console.error(err.stack)
  // res.type('text/plain')
  // res.status(500)
  // res.send('500 - Server Error')
  res.status(500)
  res.render('500')
})

app.listen(app.get('port'), () => {
  console.log('Express started on http://localhost:' + 
    app.get('port') + '; press Ctrl-C to terminate.')
})
