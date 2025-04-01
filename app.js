const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Task = require('./models/task');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/task-master')
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch(err => {
        console.error("Connection error:", err);
    });

const app = express();

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({});
    res.render('tasks/index', { tasks });
    console.log('Tasks:', tasks);
}) 

app.get('/tasks/new', (req, res) => {
    res.render('tasks/new')
})

app.post('/tasks', async(req, res) => {
    const task = new Task(req.body.task);
    await task.save();
    res.redirect(`/tasks/${task._id}`);
})

app.get('/tasks/:id', async(req, res) =>{
    const task = await Task.findById(req.params.id);
    res.render('tasks/show', { task });
})

app.get('/tasks/:id/edit', async(req, res) =>{
    const task = await Task.findById(req.params.id);
    res.render('tasks/edit', { task });
})

app.put('/tasks/:id', async(req, res) =>{
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, {...req.body.task });
    res.redirect(`/tasks/${task._id}`);
})

app.delete('/tasks/:id', async(req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect(`/tasks`);
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})