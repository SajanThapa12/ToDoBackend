const express = require('express');
//const cors = require('cors');
const connectDB = require('./db')
const Todo = require('./todo');
const bodyParser = require('body-parser')
const User = require('./user');
const app = express();
const path = require('path');
const { render } = require('ejs');
const collection = require('./app.js')
const bcrypt = require('bcrypt');
// const password = require('./password');

// app.use('/form', loginRoute);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
//middleware
// app.use(cors());
app.use(express.json());

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

//connect to Mongodb
connectDB();
// let users = [
//     { username: 'textuser', password:'$hfgdhjsfjkghg'},
// ]

// const passwordToHash =  "$rhuyri467";


// bcrypt.hash(passwordToHash, function(err, hashedPassword) {
//     if (err) {
//         console.error("Error hashing password:", err);
//         return;
//     }
//     console.log("Hashed Password:", hashedPassword);
// });

//Routes
// app.get('/', async (req, res) => {
//     const formattedTime = new Date().toLocaleTimeString();
//     return res.json({
//         message:"Hello Backend",
//         currentTime: formattedTime,
    
//     });
//})

// app.get('/', (req, res) =>{
//     res.sendFile(path.join(__dirname, 'login.ejs'));
// });

app.get('/form', async(req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    //  res.send(`Title: ${title} ,Description: {description} `);
    res.render('todo', {data:description,title});
});

app.get('/todo', async(req, res) => {
    try {
        const limit = parseInt(req.query.limit) ||10;
        const results = await Todo.find() 
         const name = "Sajan";
         return res.render('index', {data:results, name: name});
        
        // res.status(200).json({message:`Todo fetched successfully`,results}); 
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


     let data = {
         name : 'Ram',
         hobbies: ['playing football', 'riding', 'basketball']
     }
     res.render('app', {data:data });
});

app.get('/login', (req, res) => {
    // res.sendFile(path.join(__dirname, 'views', 'login'));
    // let data = {
    // username :'blacktech',
    // password : 'ewyrt674u4'
       
    //  }
     res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async(req, res) => {
   try{
     const {username, password} = req.body;
 
     const existingUser = users.find(u => u.username === username);
     if (existingUser) {
        return res.status(400).render('register', {error: 'Username already exists'});

     }
     users.push = new User(users.length +1, username, hashedPassword);
     users.push(newUser);
     res.redirect('/login');
      } catch (error) {
        console.error('Error during registration:' , error);
        res.status(500).render('register', { error: 'Internal server error' });
      }
});

//create newtodo item with title provided
 app.post('/todos', async(req, res) => {
    console.log(req.body);
    const {title,description} = req.body; 
//     const tasks = req.body.tasks;
//     const completed = req.body.completed === 'on';

//    // Ensure tasks is an array (if only one checkbox is checked, it will be a string)
//    const tasksArray = Array.isArray(tasks) ? tasks : [tasks];

    const savedTodo = await Todo.create({
        title:title,
        description:description,
    });
    res.redirect('/todo')
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


app.post('/login', async (req, res) => {
    // const { username, password} = req.body;

    // if (username === 'admin' && password === 'password') {
    //     res.send('Login successful!');
    // } else{
    //     res.status(400).json({message: 'error'})
    // }
    const data = {
        username: req.body.username,
        password: req.body.password,
    }

     await User.insertMany([data])
     res.render("login")
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
    const {title, completed} = req.body;
    try{
        const todo = await Todo.findById(id);
        if(!todo) {
            return res.status(404).json({ error: 'Todo not found'});
        }
        if (req.body.title!== undefined) {
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
