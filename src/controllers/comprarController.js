const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')
const empacotar = require('../modules/empacotar')
const entrega = require('../modules/finalizarEntrega')

function envioEmpresa(produto, empresa) {
  const pacotes = empacotar.entrada(produto, empresa)
  if(pacotes.erro){
    return pacotes

  } else {
    const pacoteFinal = entrega.finalizar(pacotes)
    return pacoteFinal
  }
}

exports.post = (req, res, next) => {
  let produto = new Produto(req.body)
  let envio = []
  envio.push(envioEmpresa(produto, 'correios'))
  envio.push(envioEmpresa(produto, 'jadlog'))
  envio.push(envioEmpresa(produto, 'viaBrasil'))
  res.status(200).send(envio)
}