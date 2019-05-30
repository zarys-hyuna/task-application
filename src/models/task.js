const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    description: {
        type: String,
        required:true,
        trim: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: 'String',
        trim: true,
        default: false
    }
},{
    timestamps: true
})
const Task = mongoose.model('Tasks', schema)

module.exports = Task