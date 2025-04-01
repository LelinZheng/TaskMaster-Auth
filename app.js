require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/task');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
const User = require('./models/user');


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

app.post('/api/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
  
      const user = new User({ username, email, password });
      await user.save();
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(201).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  
app.post('/api/login', async (req, res) => {
try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
} catch (err) {
    res.status(500).json({ error: err.message });
}
});

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