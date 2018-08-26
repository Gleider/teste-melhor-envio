const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const router = express.Router()

mongoose.connect('mongodb://gleider:gleider123@ds133262.mlab.com:33262/melhor_envio',
  { useNewUrlParser: true})
//Rotas
const index = require('./routes/index')
const personRoute = require('./routes/produtoRoute')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use('/', index)
app.use('/persons', personRoute)

module.exports = app