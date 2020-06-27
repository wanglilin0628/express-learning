const fs = require('fs')
const app = require('express')()
const formidable = require('formidable')

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
app.use(require('express-session'))

const dataDir = __dirname + '/data'
const vacationPhotoDir = dataDir + '/vacation'
fs.existsSync(dataDir) || fs.mkdirSync(dataDir)
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir)

function saveContestEntry(contestName, email, year, month, photoPath) {
  // TODO:
}

app.post('/contest/vacation/:year/:month', (req, res) => {
  let form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    if(err) {
      return res.redirect(303, '/error')
    }
    if(err) {
      res.session.flash = {
        type: 'danger',
        intro: 'Oops!',
        message: 'There was an error processing your submission. Please try again.'
      }
      return res.redirect(303, '/contest/vacation')
    }
    let photo = files.photo
    let dir = vacationPhotoDir + '/' + Date.now()
    let path = dir + '/' + photo.name
    fs.mkdirSync(dir)
    fs.renameSync(photo.path, dir + '/' + photo.name)
    saveContestEntry('vacation', files.email, req.params.year, req.params.month, path)
    req.session.flash = {
      type: 'success',
      intro: 'Good luck!',
      message: 'You have been entered into the contest.'
    }
    return res.redirect(303, '/contest/vacation/entries')
  })
})
