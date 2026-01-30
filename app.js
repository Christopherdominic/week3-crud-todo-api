const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// --- NEW BONUS ROUTE ---
// Array bonus: GET /todos/active (filter !completed)
// Positioned above /todos/:id so "active" isn't treated as an ID
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((t) => !t.completed);
  res.json(activeTodos);
});

// --- NEW SINGLE READ ROUTE ---
// GET /todos/:id (single read)
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json(todo);
});

// POST New – Create (WITH VALIDATION)
app.post('/todos', (req, res) => {
  const { task } = req.body;

  // Validation: POST requires "task" field
  if (!task || task.trim() === "") {
    return res.status(400).json({ error: "The 'task' field is required." });
  }

  const newTodo = { 
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1, 
    task, 
    completed: false 
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// Existing Completed Route
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));