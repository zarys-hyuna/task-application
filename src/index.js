const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const app = express()

app.use(express.json())



app.post('/users', async (req, res)=> {
    const user = new User(req.body)

    try{
    await user.save()
    res.status(201).send(user)
    } 
    catch (e){
        res.status(400).send(e)
    }
})

app.get('/users', async (req, res) => {
    try{
        const users = await  User.find({})
        res.status(200).send(users)
    }
    catch(e){
        res.status(500).send()
    }
})

app.get('/users/:id', async (req,res) => {
    const _id = req.params.id

    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }
    catch(e){
        res.status(500).send()
    }
})

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValid = updates.every((update)=> {
        return allowedUpdates.includes(update)
    })

    if (!isValid) {
        return res.status(400).send ({error: "Attempting to Update what cannot be updated"})
    }
 try {
     const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
     if(!user){
        return res.status(404).send()
     }
     res.send(user)
 } catch (e) {
    res.status(500).send()
 }

})


app.get('/tasks', async (req,res) => {
    try{
       const task= await Task.find({})
       res.status(200).send(task)
    }
    catch(e){
        res.status(500).send()
    }
})

app.get('/tasks/:id', async (req,res) => {
    const _id = req.params.id
    try {
       const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

app.post('/tasks', async (req, res)=> {
    const tasks = new Task(req.body)

     try {
        tasks.save()
        res.status(201).send(tasks)
     } catch (e) {
        res.status(400).send(e)
     }
})




app.listen(3000, () => {
    console.log('server is up on port 3000')
})