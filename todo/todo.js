 const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String
    },
    
   created_at: {
    type: Date,
    default: Date.now
   },
   tags: {
    type:[String]
   }, 
   currentTime: {
    type: String,
    required: true

   },
    
});

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo;