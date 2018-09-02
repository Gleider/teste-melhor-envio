const BinPacking3D = require('binpackingjs').BP3D
const limiteModels = require('../models/limitesModel')

function maxDimensao(produtos, dimensao){
  return produtos
    .map((produto) => produto.volumes[dimensao])
    .reduce((x, y) => Math.max(x, y))
}

function verificaMedidas(data, empresa) {
  
  let maxComprimento = maxDimensao(data.produtos, 'comprimento')
  let maxLargura = maxDimensao(data.produtos, 'largura')
  let maxAltura = maxDimensao(data.produtos, 'altura')
  let maxPeso = maxDimensao(data.produtos, 'peso')
  
  if(maxPeso > limiteModels[empresa].pesoMax) {
    return {erro: `O produto possui peso maior do que o suportado pela empresa ${empresa}.`}
  }
  if(maxAltura > limiteModels[empresa].alturaMax) {
    return {erro: `O produto possui altura maior do que a suportada pelos empresa ${empresa}.`}
  }
  if(maxLargura > limiteModels[empresa].larguraMax) {
    return {erro: `O produto possui largura maior do que a suportada pelos empresa ${empresa}.`}
  }
  if(maxComprimento > limiteModels[empresa].comprimentoMax) {
    return {erro: `O produto possui comprimento maior do que o suportado pelos empresa ${empresa}.`}
  }

  if(maxAltura < limiteModels[empresa].alturaMin) {
    maxAltura = limiteModels[empresa].alturaMin
  }
  if(maxLargura < limiteModels[empresa].larguraMin) {
    maxLargura = limiteModels[empresa].larguraMin
  }
  if(maxComprimento < limiteModels[empresa].ComprimentoMin) {
    maxComprimento = limiteModels[empresa].ComprimentoMin
  }
  return [maxComprimento, maxLargura, maxAltura, maxPeso]
}

function caixaMap(data, completo, empresa) {
  
  const { Item, Bin, Packer } = BinPacking3D
  let lista = []
  data.caixas.map(caixa => {
    
    let altura = caixa.altura
    let largura = caixa.largura
    let comprimento = caixa.comprimento
    let peso = limiteModels[empresa].pesoMax
    

    let bin1 = new Bin(empresa, comprimento, altura, largura, peso)
    let packer = new Packer()
    packer.addBin(bin1)

    if(completo){
      lista = produtoMap(data, packer, [comprimento, altura, largura], empresa)
      
    } else {
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
    }
  
  })
  return lista
}

function produtoMap(data, packer, medidas, empresa) {
  let comprimento = medidas[0]
  let altura = medidas[1]
  let largura = medidas[2]

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
        if(comprimento == 0){
          bin1 = new Bin(empresa, limiteModels[empresa].comprimentoMax, limiteModels[empresa].alturaMax, limiteModels[empresa].larguraMax, limiteModels[empresa].pesoMax)
        } else {
          bin1 = new Bin(empresa, comprimento, altura, largura, limiteModels[empresa].pesoMax)
        }
        packer = new Packer()
        packer.addBin(bin1)
      }
    }
  
  })
  if (packer.items.length !== 0){
    packer.pack()
    caixas.push(packer)
  }
  
  return caixas
}
function infoCompleta(data, empresa) { // fazendo
  
  let lista = caixaMap(data, true, empresa)
  
  return lista
}

function limiteProduto(data, empresa) {
  let caixas = []
  let cont = 0
  
  let medidas = verificaMedidas(data, empresa)

  const { Item, Bin, Packer } = BinPacking3D

  let bin1 = new Bin(empresa, limiteModels[empresa].comprimentoMax, limiteModels[empresa].alturaMax, limiteModels[empresa].larguraMax, limiteModels[empresa].pesoMax)
  let packer = new Packer()
  packer.addBin(bin1)

  if(medidas.erro) {
    return medidas
  }

  caixas = produtoMap(data, packer, [0,0,0], empresa)
  

  return caixas
}

function caixaDisponivel(data, empresa) {
  let lista = []
  
  lista = caixaMap(data, false, empresa)

  if(lista.length == 0) {
    return {erro: "Os produtos não cabem em nenhuma das caixas disponíveis"}
  }
  return lista
}

function semInfo(data, empresa) {
  let medidas = verificaMedidas(data, empresa)
  if(medidas.erro) {
    return medidas
  }

  let maxComprimento = medidas[0]
  let maxLargura = medidas[1]
  let maxAltura = medidas[2]
  
  const { Item, Bin, Packer } = BinPacking3D
  let maxVolume = maxComprimento * maxAltura * maxLargura
  do {
    let bin1 = new Bin(empresa, maxComprimento, maxAltura, maxLargura, limiteModels[empresa].pesoMax)
    let packer = new Packer()
    packer.addBin(bin1)
    let volume = 0
    
    data.produtos.map((produto) => {
      for(let i = 0; i < produto.quantidade; i++){
        packer.addItem(new Item(
          produto.codigo, 
          produto.volumes.comprimento, 
          produto.volumes.altura,
          produto.volumes.largura,
          produto.volumes.peso))
          volume += produto.volumes.comprimento * produto.volumes.altura * produto.volumes.largura
      }
    })
    packer.pack()
    if (packer.unfitItems.length == 0) {
      return packer
    }
    
    while(maxVolume < volume){
      if(maxComprimento == limiteModels[empresa].comprimentoMax && maxAltura == limiteModels[empresa].alturaMax && maxLargura == limiteModels[empresa].larguraMax){
        break
      }

      if(maxComprimento != limiteModels[empresa].comprimentoMax){
        maxComprimento += 1
      }
      if(maxAltura != limiteModels[empresa].alturaMax){
        maxAltura += 1
      }
      if(maxLargura != limiteModels[empresa].larguraMax){
        maxLargura += 1
      }
      maxVolume = maxComprimento * maxAltura * maxLargura
    }
    if(maxComprimento != limiteModels[empresa].comprimentoMax){
      maxComprimento += 1
    }
    if(maxAltura != limiteModels[empresa].alturaMax){
      maxAltura += 1
    }
    if(maxLargura != limiteModels[empresa].larguraMax){
      maxLargura += 1
    }
    
    if(maxComprimento == limiteModels[empresa].comprimentoMax && maxAltura == limiteModels[empresa].alturaMax && maxLargura == limiteModels[empresa].larguraMax){
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

exports.entrada = function(data, empresa) {
  let listPack = []
  
  if (data.limiteCaixas === 0 && data.caixas.length === 0) {
    while(true) {
      const pack = semInfo(data, empresa)
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
    
    data = limiteProduto(data, empresa)
    return data
  }

  if (data.limiteCaixas === 0 && data.caixas.length !== 0) {
    data = caixaDisponivel(data, empresa)
    return data
  }
  data = infoCompleta(data, empresa)
  
  return data
}