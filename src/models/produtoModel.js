const mongoose = require('mongoose')
const Schema = mongoose.Schema

const volumeSchema = new Schema({
  altura: {
    type: Number,
    required: true
  },
  largura: {
    type: Number,
    required: true
  },
  comprimento: {
    type: Number,
    required: true
  },
  peso: {
    type: Number,
    required: true
  }
})

const produtoSchema = new Schema({
  codigo: {
    type: String,
    required: true,
    trim: true
  },
  quantidade: {
    type: Number,
    default: 1
  },
  volumes: volumeSchema
})

const caixaSchema = new Schema({
  altura: {
    type: Number,
    required: true,
    default: 0
  },
  largura: {
    type: Number,
    required: true,
    default: 0
  },
  comprimento: {
    type: Number,
    required: true,
    default: 0
  }
})

const empacotamentoSchema = new Schema({
  produtos: [produtoSchema],
  caixas: [caixaSchema],
  limiteCaixas: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Produto', empacotamentoSchema)