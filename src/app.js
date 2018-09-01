const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const router = express.Router()

mongoose.connect('mongodb://gleider:gleider123@ds133262.mlab.com:33262/melhor_envio',
  { useNewUrlParser: true})

require('./models/produtoModel')
//Rotas
const index = require('./routes/index')
const produtoRoute = require('./routes/produtoRoute')
const comprarRoute = require('./routes/comprarRoute')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use('/', index)
app.use('/produtos', produtoRoute)
app.use('/comprar', comprarRoute)

module.exports = app