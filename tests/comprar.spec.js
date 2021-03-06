const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const should = chai.should()

const server = 'http://localhost:3000'
describe('Comprar test', () => {
  before(done => {
    mongoose.connect('mongodb://gleider:gleider123@ds133262.mlab.com:33262/melhor_envio',
    { useNewUrlParser: true})
    done()
  })

  describe('test database connection', () => {
    it('should return a connection', (done) => {
      chai.request(server)
        .get('/produtos')
        .end((error, res) => {
          res.body.should.be.a('array')
        done()
        })
    })
  })

  describe('test send 1 product, without limiteCaixas and without caixas', () => {
    it('should return 1 box with 1 item', (done) => {
      chai.request(server)
        .get('/produtos')
        .end((error, res) => {
          let produtos = res.body[0]
          chai.request(server)
            .post('/comprar')
            .send(produtos)
            .end((erro, res) => {
           
              res.should.have.status(200)
              res.body[0].should.have.property('quantidadeCaixas').eql(1)
              res.body[0].should.have.property('empresa').eql('correios')
              res.body[0].caixas.should.be.a('array')
              res.body[0].caixas[0].items.should.be.a('array')
              res.body[0].caixas.length.should.be.eql(1)
              res.body[0].caixas[0].items.length.should.be.eql(1)
              done()
            })
          
        })

    })
  })

  describe('test send 3 products, without limiteCaixas and without caixas', () => {
    it('should return 1 box with 3 items', (done) => {
      chai.request(server)
        .get('/produtos')
        .end((error, res) => {
          let produtos = res.body[2]
          chai.request(server)
            .post('/comprar')
            .send(produtos)
            .end((erro, res) => {
              // console.log(res.body.caixas[0])
              res.should.have.status(200)
              res.body[0].should.have.property('quantidadeCaixas').eql(1)
              res.body[0].should.have.property('empresa').eql('correios')
              res.body[0].caixas.should.be.a('array')
              res.body[0].caixas[0].items.should.be.a('array')
              res.body[0].caixas.length.should.be.eql(1)
              res.body[0].caixas[0].items.length.should.be.eql(3)
              done()
            })
          
        })

    })
  })

  describe('test send 4 products, with 155 items without limiteCaixas and without caixas', () => {
    it('should return 2 box with 4 products / 1 product', (done) => {
      chai.request(server)
        .get('/produtos')
        .end((error, res) => {
          let produtos = res.body[4]
          chai.request(server)
            .post('/comprar')
            .send(produtos)
            .end((erro, res) => {
              // console.log(res.body.caixas[0])
              res.should.have.status(200)
              res.body[0].should.have.property('quantidadeCaixas').eql(2)
              res.body[0].should.have.property('empresa').eql('correios')
              res.body[0].caixas.should.be.a('array')
      
              res.body[0].caixas[0].items.length.should.be.eql(4)
              res.body[0].caixas[1].items.length.should.be.eql(1)
              done()
            })
          
        })
 
    })
  })

  describe('test send a product with limiteCaixas = 10', () => {
    it('should return boxes with limit of 10 items', (done) => {
      chai.request(server)
        .get('/produtos')
        .end((error, res) => {
          let produtos = res.body[6]
          chai.request(server)
            .post('/comprar')
            .send(produtos)
            .end((erro, res) => {
              res.body[0].caixas[0].items[0].quantidade.should.be.eql(10)
              done()
            })
          
        })
   
    })
  })

  describe('test send products with size of boxes defined', () => {
    it('should return products with boxe defined', (done) => {
      chai.request(server)
        .get('/produtos')
        .end((error, res) => {
          let produtos = res.body[7]
          chai.request(server)
            .post('/comprar')
            .send(produtos)
            .end((erro, res) => {
              res.body[0].caixas[0].altura.should.be.eql(100)
              res.body[0].caixas[0].largura.should.be.eql(100)
              res.body[0].caixas[0].comprimento.should.be.eql(50)
              done()
            })
          
        })
    
    })
  })

  describe('test send products with size of one boxe defined', () => {
    it('should return a error because the size of box is too small', (done) => {
      chai.request(server)
        .get('/produtos')
        .end((error, res) => {
          let produtos = res.body[8]
          chai.request(server)
            .post('/comprar')
            .send(produtos)
            .end((erro, res) => {
              res.body[0].erro.should.be.eql('Os produtos não cabem em nenhuma das caixas disponíveis')
              done()
            })
          
        })
        // console.log(produtos)
        // done()
    })
  })

  describe('test send products with size of two boxes defined', () => {
    it('should return products with box defined', (done) => {
      chai.request(server)
        .get('/produtos')
        .end((error, res) => {
          let produtos = res.body[9]
          chai.request(server)
            .post('/comprar')
            .send(produtos)
            .end((erro, res) => {
              res.body[0].caixas[0].altura.should.be.eql(100)
              res.body[0].caixas[0].largura.should.be.eql(100)
              res.body[0].caixas[0].comprimento.should.be.eql(50)
              done()
            })
          
        })
    })
  })

  describe('test send products with size box and limit box defined', () => {
    it('should return products with box and limit defined correctly', (done) => {
      chai.request(server)
        .get('/produtos')
        .end((error, res) => {
          let produtos = res.body[10]
          chai.request(server)
            .post('/comprar')
            .send(produtos)
            .end((erro, res) => {
              res.body[0].caixas[0].altura.should.be.eql(100)
              res.body[0].caixas[0].items[0].quantidade.should.be.eql(5)
            
              done()
            })
        })
    })
  })

  describe('test if return 3 delivery companies', () => {
    it('should return 3 delivery companies', (done) => {
      chai.request(server)
        .get('/produtos')
        .end((error, res) => {
          let produtos = res.body[10]
          chai.request(server)
            .post('/comprar')
            .send(produtos)
            .end((erro, res) => {
              res.body[0].empresa.should.be.eql('correios')
              res.body[1].empresa.should.be.eql('jadlog')
              res.body[2].empresa.should.be.eql('viaBrasil')
              done()
            })
          
        })
    })
  })

})