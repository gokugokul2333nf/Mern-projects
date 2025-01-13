const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/todo-app")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define Todo Schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  desc: { type: String, required: [true, "Description is required"] },
  completed: { type: Boolean, default: false },
});

// Create Todo Model
const Todo = mongoose.model("Todo", todoSchema);

// Create a new todo item
app.post('/todos', async (req, res) => {
  try {
    const { title, desc } = req.body;

    if (!title || !desc) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newTodo = new Todo({ title, desc });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Retrieve all todo items
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Retrieve todos by completion status
app.get('/todos/completed/:status', async (req, res) => {
  try {
    const status = req.params.status === 'true';
    const todos = await Todo.find({ completed: status });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos by status" });
  }
});

// Retrieve a single todo by ID
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// Update a todo item by ID
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, desc, completed },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete a todo item by ID
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully", deletedTodo });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
