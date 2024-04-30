const express = require('express');
//const cors = require('cors');
const connectDB = require('./db')
const Todo = require('./todo');
// const bodyParser = require("body-parser")

const app = express();

//middleware
// app.use(cors());
app.use(express.json());

// app.set("view engine", "ejs")
//connect to MOngodb
connectDB();

//Routes

app.get('/', async (req, res) => {
    const formattedTime = new Date().toLocaleTimeString();
    return res.json({
        message:"Hello Backend",
        currentTime: formattedTime,
    
    });
})

app.get('/todo', async(req, res) => {
    try {
        const todos = await Todo.find();
        res.json({
            message: " ",
            data:todos
        })
    }
    catch(error){
        console.error(error)
    }
})


//fetch all todo itmes from db and sends back to json response
app.get('/todo/:id', async(req, res) => {
    try {
    const todos = await Todo.findById(req.params.id);
    if (!todos) {
        return res.status(404).json({ message: 'Todo not found'});
    }
    res.status(201).json({message: 'Todo fetched successfully', data: todos});
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

//create newtodo item with title provided
 app.post('/todos', async(req, res) => {
    const {title,description, tags, completed} = req.body; //{}
    // const newTodo = new Todo ({
    //     title: req.body.title,
    // });
    // newTodo.save();

    const savedTodo = await Todo.create({
        title:title,
        completed :completed,
        description:"This is todo item with description.",
        tags: ["coding", "project"]
    });
    res.status(201).json(savedTodo);
 });
 
 //updates completion status of todo
 app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    todo.completed = req.body.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
});

//delete  a todoitem with given ID from db
app.delete('/todos/:id', async (req, res) => {
    const removeTodo = await Todo.remove({_id: req.params.id});
    res.json(removeTodo);
});

//server listening
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
