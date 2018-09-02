const BinPacking3D = require('binpackingjs').BP3D
const limiteModels = require('../models/limitesModel')

function maxDimensao(produtos, dimensao){
  return produtos
    .map((produto) => produto.volumes[dimensao])
    .reduce((x, y) => Math.max(x, y))
}

function verificaMedidas(data) {
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

  if(maxAltura < limiteModels.correios.alturaMin) {
    maxAltura = limiteModels.correios.alturaMin
  }
  if(maxLargura < limiteModels.correios.larguraMin) {
    maxLargura = limiteModels.correios.larguraMin
  }
  if(maxComprimento < limiteModels.correios.ComprimentoMin) {
    maxComprimento = limiteModels.correios.ComprimentoMin
  }
  return [maxComprimento, maxLargura, maxAltura, maxPeso]
}

function caixaMap(data) {
  const { Item, Bin, Packer } = BinPacking3D
  let lista = []
  data.caixas.map(caixa => {
    
    let altura = caixa.altura
    let largura = caixa.largura
    let comprimento = caixa.comprimento
    let peso = limiteModels.correios.pesoMax

    let bin1 = new Bin("correios", comprimento, altura, largura, peso)
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
    
    if (packer.unfitItems.length === 0) {
      lista.push(packer)
      return
    }

  })
  return lista
}

function produtoMap(data, packer) {
  const { Item, Bin, Packer } = BinPacking3D
  let cont = 0
  let limite = data.limiteCaixas
  let caixas = []
  data.produtos.map(produto => {
    for(let i = 0; i < produto.quantidade; i++){
      packer.addItem(new Item(
        produto.codigo, 
        produto.volumes.comprimento, 
        produto.volumes.altura,
        produto.volumes.largura,
        produto.volumes.peso))
      cont += 1
      if (cont === limite) {
        cont = 0
        packer.pack()
        caixas.push(packer)
        packer = []
        bin1 = []
        bin1 = new Bin("correios", limiteModels.correios.comprimentoMax, limiteModels.correios.alturaMax, limiteModels.correios.larguraMax, limiteModels.correios.pesoMax)
        packer = new Packer()
        packer.addBin(bin1)
      }
    }
  })
  
  return caixas
}
function infoCompleta(data) { // fazendo
  // let caixas = []
  // let cont = 0
  // let medidas = verificaMedidas(data)

  // const { Item, Bin, Packer } = BinPacking3D

  // let bin1 = new Bin("correios", limiteModels.correios.comprimentoMax, limiteModels.correios.alturaMax, limiteModels.correios.larguraMax, limiteModels.correios.pesoMax)
  // let packer = new Packer()
  // packer.addBin(bin1)

  // if(medidas.erro) {
  //   return medidas
  // }

  // caixas = produtoMap(data, packer)
  // if (packer.items.length !== 0){
  //   packer.pack()
  //   caixas.push(packer)
  // }
  return {erro:"error"}
}

function limiteProduto(data) {
  let caixas = []
  let cont = 0
  let medidas = verificaMedidas(data)

  const { Item, Bin, Packer } = BinPacking3D

  let bin1 = new Bin("correios", limiteModels.correios.comprimentoMax, limiteModels.correios.alturaMax, limiteModels.correios.larguraMax, limiteModels.correios.pesoMax)
  let packer = new Packer()
  packer.addBin(bin1)

  if(medidas.erro) {
    return medidas
  }

  caixas = produtoMap(data, packer)
  if (packer.items.length !== 0){
    packer.pack()
    caixas.push(packer)
  }

  return caixas
}

function caixaDisponivel(data) {
  let lista = []
  
  lista = caixaMap(data)

  if(lista.length == 0) {
    return {erro: "Os produtos não cabem em nenhuma das caixas disponíveis"}
  }
  return lista
}

function semInfo(data) {

  let medidas = verificaMedidas(data)
  if(medidas.erro) {
    return medidas
  }

  let maxComprimento = medidas[0]
  let maxLargura = medidas[1]
  let maxAltura = medidas[2]
  
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

}

function geraNovoData(info, dataAnterior){
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
    limiteCaixas: dataAnterior.limiteCaixas,
    produtos: prod
  }
  return data
}

exports.entrada = function(data) {
  let listPack = []
  if (data.limiteCaixas === 0 && data.caixas.length === 0) {
    while(true) {
      const pack = semInfo(data)
      if (pack.erro){
        return pack
      }
      listPack.push(pack)

      if(pack.unfitItems.length === 0){
        return listPack
      }
      data = geraNovoData(pack.unfitItems, data)
    }

  }
  if (data.limiteCaixas !== 0 && data.caixas.length === 0) {
    data = limiteProduto(data)
    return data
  }

  if (data.limiteCaixas === 0 && data.caixas.length !== 0) {
    data = caixaDisponivel(data)
    return data
  }
  data = infoCompleta(data)
  return data
}