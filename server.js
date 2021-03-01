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

let BracketRoute = require('./src/backend/routes/bracket.route')
app.use('/api/bracket', BracketRoute)

let JoueurRoute = require('./src/backend/routes/joueur.route')
app.use('/api/joueur', JoueurRoute)

let PoulesRoute = require('./src/backend/routes/poule.route')
app.use('/api/poule', PoulesRoute)

let TableauRoute = require('./src/backend/routes/tableau.route')
app.use('/api/tableau', TableauRoute)

let AccountRoute = require('./src/backend/routes/account.route')
app.use('/api/account', AccountRoute)

let ParametreRoute = require('./src/backend/routes/parametre.route')
app.use('/api/parametre', ParametreRoute)

let BuffetRoute = require('./src/backend/routes/buffet.route')
app.use('/api/buffet', BuffetRoute)

let BinomeRoute = require('./src/backend/routes/binome.route')
app.use('/api/binome', BinomeRoute)

let StockRoute = require('./src/backend/routes/stock.route')
app.use('/api/stock', StockRoute)

let port = process.env.PORT || 4000
app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
