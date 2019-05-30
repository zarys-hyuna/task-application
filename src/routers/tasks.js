const express = require('express')
const Task = require('../models/task')
const authorization = require('../middleware/authorization')
const router = new express.Router()

router.delete('/tasks/:id',authorization, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        return res.status(500).send()
    }
})

router.patch('/tasks/:id', authorization, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValid) {
        return res.status(400).send ({error: "Attempting to Update what cannot be updated"})
    }

    try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
   
    if(!task){
            return res.status(404).send()
    }

    updates.forEach((update) => task[update] = req.body[update])
    task.save()
    res.send(task)
    } 
    catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks', authorization, async (req,res) => {
    try{
        const tasks = await Task.find({owner: req.user._id})
        res.send(tasks)
    }
    catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id', authorization, async (req,res) => {
    const _id = req.params.id
    try {
       const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/tasks', authorization, async (req, res)=> {
    const tasks = new Task({
        ...req.body,
        owner: req.user._id
    })

     try {
        tasks.save()
        res.status(201).send(tasks)
     } catch (e) {
        res.status(400).send(e)
     }
})


module.exports = router