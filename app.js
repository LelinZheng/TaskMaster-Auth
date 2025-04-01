const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the TaskMaster API!');
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find({});
    res.json(tasks);
}) 

// Create task
app.post('/api/tasks', async(req, res) => {
    const task = new Task(req.body);
    const savedTask = await task.save();
    console.log('Saved task:', savedTask); // debug line
    res.status(201).json(savedTask);
})

// Get one task
app.get('/api/tasks/:id', async(req, res) =>{
    const task = await Task.findById(req.params.id);
    res.json(task);
})

// Update task
app.put('/api/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
});

// Delete task
app.delete('/api/tasks/:id', async(req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
})

app.all('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

console.log('\n📦 Registered Routes:');
app._router.stack.forEach(r => {
  if (r.route) {
    console.log(`${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
  }
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
})