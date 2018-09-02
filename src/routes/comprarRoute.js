const express = require('express')
const router = express.Router()
const controller = require('../controllers/comprarController')

/** Rota para para enviar informações sobre os produtos */
router.post('/', controller.post)

module.exports = router