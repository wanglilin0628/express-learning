const express = require('express')
const app = express()
const { getFortune } = require('./lib/fortune')
const { static } = require('express')
const parse = require('body-parser')()

const hour = 1000 * 60 * 60;
const sessionOpts = {
  secret: 'a cool secret',
  resave: true,
  saveUninitalized: true,
  key: 'myapp_sid',
  cookie: {
    maxAge: hour * 2,
    secure: false
  }
}

app.use(require('cookie-parser')())
app.use(require('express-session')(sessionOpts))
app.use(parse)


// 设置handlebars
const handlebars = require('express-handlebars').create({
  defaultLayout:'main',
  helpers: {
    section: (name, options) => {
        if(!this._sections) this._sections = {}
        this._sections[name] = options.fn(this)
        return null;
    }
  }
});
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.set('port', process.env.PORT || 8080)

app.use(static(__dirname + '/public'))

app.use((req, res, next) => {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1'
  next()
})

app.use((req, res, next) => {
  // 如果有即显消息，把它传到上下文中，然后清楚它
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})

// 在404处理器之前加上两个新路由
app.get('/', (req, res) => {
  res.render('home')
})

const VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

app.get('/newsletter', (req, res) => {
    // res.render('newsletter', {csrf: 'CSRF token goes here'})
    let name = req.body.name || ''
    let email = req.body.email || ''

    if (!email.match(VALID_EMAIL_REGEX)) {
      if (req.xhr) {
        return res.json({error: 'Invalid name email address.'})
      }
      req.session.flash = {
        type: 'danger',
        intro: 'Validator error!',
        message: 'The email address you entered was not valid.'
      }
      return res.redirect(303, '/newsletter/archive')
    }
    new NewsletterSignup({ name: name, email: email}).save((err) => {
      if (err) {
        if (req.xhr) {
          return res.json({ success: true })
        }
        req.session.flash = {
          type: 'success',
          intro: 'Thank you',
          message: 'You have now been signed up for the newsletter'
        }
        return res.redirect(303, '/newsletter/archive')
      }
      if (req.xhr) {
        return res.json({ success: true })
      }
      req.session.flash = {
        type: 'success',
        intro: 'Thank you',
        message: 'You have now been signed up for the newsletter.'
      }
      return res.redirect(303, '/newsletter/archive')
    })
})

app.get('/thank-you', function(req, res){
	res.render('thank-you');
})

app.post('/process', (req, res) => {
    // console.log('Form(form querystring): ' + req.query.form)
    // console.log('CSRF token(from hidden form field): ' + req.body._csrf)
    // console.log('Name: ' + req.body.name)
    // console.log('Email: ' + req.body.email)
    // res.redirect(303, '/thank-you')
    if (req.xhr || req.accepts('json,html') === 'json') {
      res.send({success: true})
    } else {
      res.redirect(303, '/thank-you')
    }
})

app.get('/jquerytest', (req, res) => {
	res.render('jquerytest');
})

app.get('/headers', (req, res) => {
  res.set('Content-Type', 'text/plain')
  let s = ''
  for (var name in req.headers) {
    s += name + ': ' + req.headers[name] + '\n'
  }
  res.send(s)
})

app.get('/about', (req, res) => {
  res.render('about', { fortune: getFortune() })
})

// 404 catch-all处理器 (中间件)
app.use((req, res, next) => {
  res.status(404)
  res.render('404')
})

// 定义500页面
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500)
  res.render('500')
})

app.listen(app.get('port'), () => {
  console.log('Express started on http://localhost:' + 
    app.get('port') + '; press Ctrl-C to terminate.')
})
