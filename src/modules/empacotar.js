const bin = require('./binPacking')

function infoCompleta() {

}

function limiteProduto() {

}

function caixaDisponivel() {

}

function semInfo(data) {

  return data
}

function maxDimensao(produtos, dimensao){
  return produtos
    .map((produto) => produto.volumes[dimensao])
    .reduce((x, y) => Math.max(x, y))
}

exports.entrada = function(data) {
  const maxComprimento = maxDimensao(data.produtos, 'comprimento')
  const maxLargura = maxDimensao(data.produtos, 'largura')
  const maxAltura = maxDimensao(data.produtos, 'altura')

  if (data.limiteCaixas === 0 && data.caixas.length === 0) {
    return semInfo(data)
  }
  return data
}