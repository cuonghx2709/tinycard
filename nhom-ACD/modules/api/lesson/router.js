const express = require('express')
const lessonController = require('./controller')
const router = express.Router()

router.get('/', (req, res) =>{
    lessonController.getAll().then(data => res.send(data))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.post('/', (req, res) =>{
    lessonController.createLesson(req.body).then(data => res.send(data))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.get('/:idlesson', (req, res) => {
    lessonController.getLesson(req.params.idlesson).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send(err)
    })
})

module.exports = router