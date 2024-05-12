const express = require('express');
//const cors = require('cors');
const connectDB = require('./db')
const Todo = require('./todo');
// const bodyParser = require("body-parser")
 const User = require('./user');
const app = express();
const path = require('path');
// app.set('view engine', 'ejs');
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
        const limit = parseInt(req.query.limit) ||10;

        const results = await Todo.find().limit(limit); 
        res.status(200).json({message:`Todo fetched successfully`,results}); 
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
    // res.status(200).json({message: 'Todo fetched succe.ssfully', data: todos});

} catch (error) {
    res.status(400).json({ message: error.message });
}
});


app.get('/home', async(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
    // let data = {
    //     name : 'Intern',
    //     hobbies: ['playing football', 'riding', 'basketball']
    // }
    // res.render('index', {data: data });
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
        tags: ["coding", "project"],
        currentTime: new Date(),
    });
    res.status(201).json(savedTodo);
 });

 
 app.post('/user',async(req, res) => {
    const {username,email,address,password} = req.body;
    try{
        const user = new User({username, email, address, password});
        await user.save();
        res.status(201).json({message:'user created'});
    } catch(error) {
        res.status(400).json({ error: error.message});
    }
});



 //updates completion status of todo
 app.put('/todos/:id', async (req, res) => {
   try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
        return res.status(404).send('Todo not found');
    }
     todo.title = req.body.title;
    todo.completed = req.body.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
}
 catch (error) {
    res.status(400).send(error);
 }
});

app.patch('/todo/:id', async (req, res) => {
    const { id } = req.params;
    const {completed} = req.body;
    try{
        const todo = await Todo.findById(id);
        if(!todo) {
            return res.status(404).json({ error: 'Todo not found'});
        }
        if (req.body.title !== undefined) {
            todo.title = req.body.title;
        }
        if (req.body.completed != undefined)
            todo.completed = completed;
        await todo.save();
        return res.json(todo);
    } catch (error) {
        console.error('Error update todo', error);
        return res.status(500).json({error: 'Internal server error'});
    }
 
});

//delete  a todoitem with given ID from db
app.delete('/todos/:id', async (req, res) => {
    const removeTodo = await Todo.findByIdAndDelete({_id: req.params.id});
    res.json(removeTodo);
});

//server listening
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
