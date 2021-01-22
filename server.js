const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DB_HOST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {})

app.use(session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

const path = require('path')
app.use(express.static(path.join(__dirname, 'dist/')))

app.get('/api', function (req, res) {
  res.json({ status: 'Working' })
})

let BracketController = require('./src/backend/controller/BracketController')
app.use('/api/bracket', BracketController)

let JoueurController = require('./src/backend/controller/JoueurController')
app.use('/api/joueur', JoueurController)

let PoulesController = require('./src/backend/controller/PoulesController')
app.use('/api/poule', PoulesController)

let TableauController = require('./src/backend/controller/TableauController')
app.use('/api/tableau', TableauController)

let AccountController = require('./src/backend/controller/AccountController')
app.use('/api/account', AccountController)

let ParametreController = require('./src/backend/controller/ParametreController')
app.use('/api/parametre', ParametreController)

let BuffetController = require('./src/backend/controller/BuffetController')
app.use('/api/buffet', BuffetController)

let BinomeController = require('./src/backend/controller/BinomeController')
app.use('/api/binome', BinomeController)

let port = process.env.PORT || 4000
app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
