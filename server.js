const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

const reactionsFile = 'reactions.json';

app.use(express.json());
app.use(express.static('public'));


// GET reakcija po textId
app.get('/get_counts/:textId', (req, res) => {
  const textId = req.params.textId;
  let reactions = {};
  if (fs.existsSync(reactionsFile)) {
    const content = fs.readFileSync(reactionsFile, 'utf8');
    reactions = content ? JSON.parse(content) : {};
  }
  if (!reactions[textId]) reactions[textId] = { like: 0, hate: 0, confused: 0 };
  res.json(reactions[textId]);
});

// POST update reakcije
app.post('/update_count', (req, res) => {
  const { textId, type } = req.body;
  let reactions = {};
  if (fs.existsSync(reactionsFile)) {
    const content = fs.readFileSync(reactionsFile, 'utf8');
    reactions = content ? JSON.parse(content) : {};
  }
  if (!reactions[textId]) reactions[textId] = { like: 0, hate: 0, confused: 0 };
  reactions[textId][type]++;
  fs.writeFileSync(reactionsFile, JSON.stringify(reactions, null, 2));
  res.json({ success: true, counts: reactions[textId] });
});

app.listen(PORT, () => console.log(`Server radi na http://localhost:${PORT}`));
