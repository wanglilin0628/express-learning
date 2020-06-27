const app = require('express')()

app.set('port', process.env.PORT || 8080)

let staff = {
  portland: {
    mitch: {bio: 'xxx'},
    madeline: {bio: 'aaa'}
  },
  bend: {
    walt: {bio: 'www'}
  }
}

app.get('/staff/:city/:name', (req, res) => {
  let info = staff[req.params.city][req.params.name]
  if (!info) {
    return next()
  }
  res.send(JSON.stringify(info))
})

app.listen(app.get('port'), () => {
  console.log('Express started on http://localhost:' + 
    app.get('port') + '; press Ctrl-C to terminate.')
})
