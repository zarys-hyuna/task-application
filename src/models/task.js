const mongoose = require('mongoose')

const schema = {
    description: {
        type: String,
        required:true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}
const Task = mongoose.model('Tasks', schema)

module.exports = Task