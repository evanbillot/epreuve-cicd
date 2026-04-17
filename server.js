const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tasks = [
  { id: 1, title: 'Learn DevSecOps', completed: false }
];

// ===== Monitoring =====
let requests = 0;

app.use((req, res, next) => {
  requests++;
  next();
});

// ======================

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const task = { id: tasks.length + 1, ...req.body, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// ===== Endpoint metrics =====
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`requests_total ${requests}`);
});

// ============================

// ⚠️ FIX IMPORTANT POUR TESTS
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;