const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Task = require('./models/task');


mongoose.connect('mongodb://localhost:27017/task-master')
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch(err => {
        console.error("Connection error:", err);
    });

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/maketask', async(req, res) => {
    const task = new Task({ title: "Laundry", description: "Do Laundry for all clothes"});
    await task.save();
    res.send(task);
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})