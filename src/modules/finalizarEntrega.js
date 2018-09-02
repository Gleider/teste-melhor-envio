/** Este módulo tem o objetivo de pegar os items empacotados no módulo de empacotar e retornar
 * ele formatado em JSON para ser enviado como resposta do servidor
 */

 /** Calcula o peso da caixa com os itens que estão dentro */
function pesoCaixa(items) {
  return items
    .map((p) => p.weight)
    .reduce((a, b) => a + b)
}

/** Deixa todos os produtos no formato correto */
function itensCaixa(items) {
  prods = []
  produtos = []
  items.map(i => {
    if(prods.indexOf(i.name) === -1){
      prods.push(i.name)
      produtos.push({
        codigo: i.name,
        comprimento: i.width,
        altura: i.height,
        largura: i.depth,
        peso: i.weight,
        quantidade: 1})
    } else {
      produtos[prods.indexOf(i.name)].quantidade += 1
    }
  })
  return produtos
}

/** Função principal que é chamada
 *  Tem o objetivo de retornar os produtos no formato correto
 */
exports.finalizar = function(pacotes) {
  caixas = []
  pacotes.map((p) => {
    caixas.push({
      altura: p.bins[0].height,
      largura: p.bins[0].depth,
      comprimento: p.bins[0].width,
      peso: pesoCaixa(p.bins[0].items),
      items: itensCaixa(p.bins[0].items)
    })
  })
  entrega = {
    quantidadeCaixas : pacotes.length,
    empresa : pacotes[0].bins[0].name,
    caixas
  }

  return entrega
}