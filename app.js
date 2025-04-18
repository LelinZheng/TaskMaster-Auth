// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');

const requireAuth = require('./middleware/requireAuth');
const Task = require('./models/task');
const User = require('./models/user');

const PORT = process.env.PORT || 3000; //default to 3000 for local
const app = express();

/**
 * Allowed origins for CORS, based on environment (on Cloud or locally)
 * @type {string[]}
 */
const allowedOrigins =
process.env.NODE_ENV === 'production'
? ['https://task-master-auth.vercel.app']
: ['http://localhost:3000', 'http://localhost:3001'];

/**
 * CORS middleware options
 * @type {{credentials: boolean, methods: string[], origin: corsOptions.origin}}
 */
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// To avoid testing changing the actual database
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected!'))
    .catch((err) => console.error('Connection error:', err));
  }


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the TaskMaster API!');
});

// Get all tasks for one user
app.get('/api/tasks', requireAuth, async (req, res) => {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
}) 

// Create task
app.post('/api/tasks', requireAuth, async(req, res) => {
    try {
        const task = new Task({ ...req.body, user: req.userId });
        await task.save();
        res.status(201).json(task);
      } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.fromEntries(
                Object.entries(err.errors).map(([field, val]) => [field, val.message])
            );
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: 'Server error while creating task' });
      }
})

// Get one task
app.get('/api/tasks/:id', async(req, res) =>{
    const task = await Task.findById(req.params.id);
    res.json(task);
})

// Update task
app.put('/api/tasks/:id', requireAuth, async (req, res) => {

    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        req.body,
        { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
});

// Delete task
app.delete('/api/tasks/:id', requireAuth, async(req, res) => {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted' });
})

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
    
        const user = new User({ username, email, password });
        await user.save();
    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ token });
    
    } catch (err) {
        if (err.code === 11000) { // MongoDB duplicate key error
          const field = Object.keys(err.keyValue)[0];
          const value = err.keyValue[field];
          return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" is already taken.` });
        }

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

console.log('\n Registered Routes:');
app._router.stack.forEach(r => {
  if (r.route) {
    console.log(`${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
  }
});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});

module.exports = app;