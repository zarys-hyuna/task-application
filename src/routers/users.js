const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const authorization = require('../middleware/authorization')


router.post('/users', async (req, res)=> {
    const user = new User(req.body)

    try{
    await user.save()
    const token = await user.generateAuthorizationToken()
    res.status(201).send({user, token})
    } 
    catch (e){
        res.status(400).send(e)
    }
})

router.get('', (req, res) => {
 res.render('index')
})

router.post('/users/login', async (req, res) => {
    try {
        console.log(req)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthorizationToken()
        res.status(200).send({ user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout',  authorization , async (req, res) => {
    try {
        
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        
        await req.user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', authorization, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/profile', authorization ,async (req, res) => {
    res.send(req.user)
})



router.patch('/users/profile', authorization, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValid = updates.every((update)=> {
        return allowedUpdates.includes(update)
    })

    if (!isValid) {
        return res.status(400).send ({error: "Attempting to Update what cannot be updated"})
    }

 try {

     updates.forEach((update) => req.user[update] = req.body[update])
     await req.user.save()

     res.send(req.user)

 } catch (e) {
    res.status(500).send()
 }

})

router.delete('/users/profile', authorization, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        return  res.status(500).send()
    }
})


module.exports = router