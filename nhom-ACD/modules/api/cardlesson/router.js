const express = require('express')
const cardController = require('./controller')
const router = express.Router()

router.get('/', (req, res) =>{
    cardController.getAll().then(data => res.send(data))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.post('/', (req, res) =>{
    cardController.createCard(req.body).then(data => res.send(data))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.get('/:idcard', (req, res) => {
    cardController.getCard(req.params.idcard).then(data => res.send(data))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

module.exports = router