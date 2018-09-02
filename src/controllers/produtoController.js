const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')

exports.get = (req, res, next) => {
  Produto.find({}, 'limiteCaixas produtos caixas')
    .then(data => {
      res.status(200).send(data)
    }).catch(erro => {
      res.status(400).send({ data : erro })
    })
}

exports.post = (req, res, next) => {
  let produto = new Produto(req.body)
  produto
    .save()
    .then(data => {
      res.status(201).send({ message : "Produto cadastrado com sucesso" })
    }).catch(erro => {
      res.status(400).send({ message: "Falha ao cadastrar", data : erro })
    })

}

exports.put = (req, res, next) => {
  let id = req.params.id
  res.status(201).send(`Requisição recebida com sucesso! ${id}`)
}

exports.delete = (req, res, next) => {
  let id = req.params.id
  res.status(200).send(`Requisição recebida com sucesso! ${id}`)
}