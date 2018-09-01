const BinPacking3D = require('binpackingjs').BP3D
const limiteModels = require('../models/limitesModel')

function maxDimensao(produtos, dimensao){
  return produtos
    .map((produto) => produto.volumes[dimensao])
    .reduce((x, y) => Math.max(x, y))
}

function infoCompleta() {

}

function limiteProduto() {

}

function caixaDisponivel() {

}

function semInfo(data) {
  let maxComprimento = maxDimensao(data.produtos, 'comprimento')
  let maxLargura = maxDimensao(data.produtos, 'largura')
  let maxAltura = maxDimensao(data.produtos, 'altura')
  let maxPeso = maxDimensao(data.produtos, 'peso')

  
  if(maxPeso > limiteModels.correios.pesoMax) {
    return {erro: "O produto possui peso maior do que o suportado pelos correios"}
  }
  if(maxAltura > limiteModels.correios.alturaMax) {
    return {erro: "O produto possui altura maior do que a suportada pelos correios."}
  }
  if(maxLargura > limiteModels.correios.larguraMax) {
    return {erro: "O produto possui largura maior do que a suportada pelos correios."}
  }
  if(maxComprimento > limiteModels.correios.comprimentoMax) {
    return {erro: "O produto possui comprimento maior do que o suportado pelos correios."}
  }

  if(maxAltura < limiteModels.correios.alturaMin){
    maxAltura = limiteModels.correios.alturaMin
  }
  if(maxLargura < limiteModels.correios.larguraMin){
    maxLargura = limiteModels.correios.larguraMin
  }
  if(maxComprimento < limiteModels.correios.ComprimentoMin){
    maxComprimento = limiteModels.correios.ComprimentoMin
  }

  const { Item, Bin, Packer } = BinPacking3D

  do {
    let bin1 = new Bin("correios", maxComprimento, maxAltura, maxLargura, limiteModels.correios.pesoMax)
    let packer = new Packer()
    packer.addBin(bin1)
    data.produtos.map((produto) => {
      for(let i = 0; i < produto.quantidade; i++){
        packer.addItem(new Item(
          produto.codigo, 
          produto.volumes.comprimento, 
          produto.volumes.altura,
          produto.volumes.largura,
          produto.volumes.peso))
      }
    })
    packer.pack()
    // console.log(packer)
    if (packer.unfitItems.length == 0) {
      return packer
    }
    
    if(maxComprimento != limiteModels.correios.comprimentoMax){
      maxComprimento += 1
    }
    if(maxAltura != limiteModels.correios.alturaMax){
      maxAltura += 1
    }
    if(maxLargura != limiteModels.correios.larguraMax){
      maxLargura += 1
    }
    
    if(maxComprimento == limiteModels.correios.comprimentoMax && maxAltura == limiteModels.correios.alturaMax && maxLargura == limiteModels.correios.larguraMax){
      return packer
    }

  } while(true)
  // console.log("unfited:", packer.unfitItems)

}

function geraNovoData(info){
  // info.map((dado) => console.log(dado.name))
  prod = []
  info.map((dado) => {
    prod.push(
      {
        quantidade: 1,
        codigo: dado.name,
        volumes: {
          altura: dado.height,
          largura: dado.depth,
          comprimento: dado.width,
          peso: dado.weight
        }
      }
    )
  })
  data = {
    produtos: prod
  }
  return data
}


exports.entrada = function(data) {
  let listPack = []
  if (data.limiteCaixas === 0 && data.caixas.length === 0) {
    while(true) {
      const pack = semInfo(data)
      listPack.push(pack)
      if(pack.unfitItems.length === 0){
        // console.log(listPack[1].bins[0].items)
        return listPack
      }
      data = geraNovoData(pack.unfitItems)
      
    }
    // console.log(pack.unfitItems)
    // console.log(data.produtos)
    return pack
  }
  return data
}