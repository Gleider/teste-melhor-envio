/** Controle dos dados referente aos produtos que são enviados */

const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')
const empacotar = require('../modules/empacotar')
const entrega = require('../modules/finalizarEntrega')

/** Função para enviar os dados do produto e qual empresa (correios, jadlog ou viaBrasil) */
function envioEmpresa(produto, empresa) {
  /** A função empacotar serve para pegar os dados de entrada e calcular a melhor forma de organizar
   * os pacotes, pode retornar:
   *  Erro: quando ultrapassa o mínimo de pacote de uma das empresas
   *  Array: neste array possui informações sobre sobre cada pacote separadamente
  */
  const pacotes = empacotar.entrada(produto, empresa)
  if(pacotes.erro){
    return pacotes

  } else {
    /** Caso não ocorra erro, é chamada a função de finalizar o pacote.
     *  Esta função retorna os dados organizados em json para serem enviados pelo servidor
     */
    const pacoteFinal = entrega.finalizar(pacotes)
    return pacoteFinal
  }
}

exports.post = (req, res, next) => {
  let produto = new Produto(req.body)
  let envio = []
  /** Armazena no vetor 'envio' as informações calculadas pela função de organizar os pacotes  */
  envio.push(envioEmpresa(produto, 'correios'))
  envio.push(envioEmpresa(produto, 'jadlog'))
  envio.push(envioEmpresa(produto, 'viaBrasil'))
  /** Envia para o cliente a resposta contendo informações de cada uma das empresas de transporte */
  res.status(200).send(envio)
}