const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.get('/status', (req, res) => {
  res.send({
    message: 'hello world! '
  })
})

app.post('/sendComment', (req, res) => {
  res.send({
    message: `Your comment "${req.body.comment}" was saved`
  })
})

/*app.post('/register', (req, res) => {
  res.send({
    message: `Hello ${req.body.email} your user was registered, have fun`
  })
})*/

app.listen(process.env.PORT || 8081)
