const express = require('express')
const router = express.Router()
const controller = require('../controllers/produtoController')

/** Rotas referente aos métodos para adicionar, remover, alterar e consultar produtos no banco de dados */
router.get('/', controller.get)
router.post('/', controller.post)
router.put('/:id', controller.put)
router.delete('/', controller.delete)

module.exports = router