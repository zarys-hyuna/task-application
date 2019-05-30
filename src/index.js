const express = require('express')
require('./db/mongoose')
var bodyParser = require("body-parser")

const app = express()
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')
const hbs = require('hbs')
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(userRouter)
app.use(taskRouter)

app.set('view engine', 'hbs')
hbs.registerPartials('/home/internnum5/Node stuff/task-application/views/partials')
app.use(express.static('/home/internnum5/Node stuff/task-application/public'))



app.listen(3000, () => {
    console.log('server is up on port 3000')
})