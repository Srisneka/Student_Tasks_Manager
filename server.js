const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + '/client')); 

mongoose.connect('mongodb://127.0.0.1:27017/student_tasks', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    await Course.init();
    await Task.init();
});


const Course = mongoose.model('Course', {
    studentName: String,
    courseId: String,
    courseName: String,
    
});

const Task = mongoose.model('Task', {
    courseId: String,
    taskName: String,
    dueDate: Date,
    details: String
});

app.post('/courses', async (req, res) => {
    try {
        const { studentName, courseId, courseName } = req.body; 
        const newCourse = new Course({ studentName, courseId, courseName });
        await newCourse.save();
        res.status(201).json({ message: 'Course added successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add course.' });
    }
});


app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve courses.' });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const { courseId, taskName, dueDate, details } = req.body;
        const newTask = new Task({ courseId, taskName, dueDate, details });
        await newTask.save();
        res.status(201).json({ message: 'Task added successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add task.' });
    }
});
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve courses.' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/courses/:courseId/tasks', async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const tasks = await Task.find({ courseId });
        if (tasks.length === 0) {
            res.status(404).json({ error: 'No tasks found for the specified course ID.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
