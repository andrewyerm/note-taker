const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Read the database file
const getNotes = () => {
  const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
  return JSON.parse(data);
};

// Save notes to the database file
const saveNotes = (notes) => {
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2));
};

// API Route: Get all notes
app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

// API Route: Add a new note
app.post('/api/notes', (req, res) => {
  const notes = getNotes();
  const newNote = req.body;
  newNote.id = Math.floor(Math.random() * 100000); // Generate a simple unique ID
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

// API Route: Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const notes = getNotes();
  const noteId = parseInt(req.params.id);
  const updatedNotes = notes.filter(note => note.id !== noteId);
  saveNotes(updatedNotes);
  res.json({ message: 'Note deleted successfully!' });
});

// Route for serving the notes.html page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Default route for serving the index.html page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
