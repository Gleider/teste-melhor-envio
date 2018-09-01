const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')
const empacotar = require('../modules/empacotar')
const entrega = require('../modules/finalizarEntrega')

exports.post = (req, res, next) => {
  let produto = new Produto(req.body)
  const pacotes = empacotar.entrada(produto)
  const pacoteFinal = entrega.finalizar(pacotes)
  res.status(200).send(pacoteFinal)
}