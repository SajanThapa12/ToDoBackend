const express = require('express');
//const cors = require('cors');
const connectDB = require('./db')
const Todo = require('./todo');
const bodyParser = require('body-parser')
const User = require('./user.js')
const app = express();
const path = require('path');
const { render } = require('ejs');
const collection = require('./app.js')
const bcrypt = require('bcrypt');
// const password = require('./password')
// app.use('/form', loginRoute);
const userRouter = require('./Routes/users.js');
const { users } = require('./models/user.service.js');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
//middleware
// app.use(cors());
app.use(express.json());

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

//connect to Mongodb
connectDB();

app.use('/user',userRouter);


app.get('/form', async(req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    //  res.send(`Title: ${title} ,Description: {description} `);
    res.render('todo', {data:description,title});
});


app.get('/todo', async(req, res) => {
    try {
        const limit = parseInt(req.query.limit) ||10;
        const results = await Todo.find(req.params) 
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
     res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/user', async (req, res) => {
    const users = await User.find({}, '-username');
    return res.status(200).json({
        data: users
   })
});

app.post('/register', async(req, res) => {
   try{
    console.log(req.body)
     const {username, email, password} = req.body;
     const savedUser = await User.create({
        username:username,
        password:password,
        email: email,
     });
    //  res.redirect('/login');
 
     const existingUser = await User.find({username});
     if (existingUser) {
        return res.status(400).render('register', {error: 'Username already exists'});

     }
     const newUser = new User(User.length +1, username, password);
     User.push(newUser);
    //  res.redirect('/login');
      } catch (error) {
        console.error('Error during registration:' , error);
        // res.status(500).render('register', { error: 'Internal server error' });
      }
});

//create newtodo item with title provided
 app.post('/todos', async(req, res) => {
    console.log(req.body);
    const {title,description} = req.body; 
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


// app.post('/login', async (req, res) => {
   
//     const data = {
//         username: req.body.username,
//         password: req.body.password,
//     }

//      await User.insertMany([data])
//      res.render("login")
// });
 

app.post('/login', async(req, res) => {
    const {eamil, password} = req.body;

    try{
        const user = await User.find({Email});
        if (!user) {
            return res.status(401).json({ error: 'Invalid '});        
    }
    const isPasswordValid = await bcrypt.compare(password, User.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid'});
    }

    const token = generateToken(user);
    return res.status(200).json({token});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server Error'});
    }
});

function authenticate(req, res, next) {
    const token = req.headers.authorization;
    if(!token) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    try{
        const decoded = verifyToken(token);
        req.user = decoded.user;
        next();
    }catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized'});
    }
}

app.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'You are authorized'});
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
