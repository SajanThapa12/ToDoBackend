const express = require('express');
const router = require('./users');
const router = express.Router();

const UserService = ('../services/UserServices');

//mock database
let todos = [];

//middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.sesion.userId) {
        const user = UserService.findUserById(req.session.userId);
        if(user) {
            req.user = user; //attach user to request
        }
     }
     res.redirect('/login');
    }
// Get all todos
router.get('/', isAuthenticated, (req, res) => {
    res.render('index', { todos });
  });
  
  // Add new todo form
  router.get('/add', isAuthenticated, (req, res) => {
    res.render('add');
  });
  
  // Add new todo
 router.post('/add', isAuthenticated, (req, res) => {
    const todo = {
      id: todos.length + 1,
      text: req.body.text,
      completed: false,
    };
    todos.push(todo);
    res.redirect('/');
  });
  
  // Edit todo form
router.get('/edit/:id', isAuthenticated, (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Todo not found');
    res.render('edit', { todo });
  });
  
  // Edit todo
  router.post('/edit/:id', isAuthenticated, (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Todo not found');
  
    todo.text = req.body.text;
    todo.completed = req.body.completed === 'on';
    res.redirect('/');
  });
  
  // Delete todo
  router.post('/delete/:id', isAuthenticated, (req, res) => {
    todos = todos.filter(t => t.id !== parseInt(req.params.id));
    res.redirect('/');
  });
  
  module.exports = app;