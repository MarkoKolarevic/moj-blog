const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Apsolutna putanja do reactions.json
const reactionsFile = path.join(__dirname, 'reactions.json');

// Ako fajl ne postoji, kreiraj prazan JSON
if (!fs.existsSync(reactionsFile)) {
  fs.writeFileSync(reactionsFile, '{}');
}

app.use(cors()); // dozvoljava sve domene
app.use(express.json());
app.use(express.static('public'));

// GET reakcija po textId
app.get('/get_counts/:textId', (req, res) => {
  const textId = req.params.textId;
  let reactions = {};
  const content = fs.readFileSync(reactionsFile, 'utf8');
  reactions = content ? JSON.parse(content) : {};
  if (!reactions[textId]) reactions[textId] = { like: 0, hate: 0, confused: 0 };
  res.json(reactions[textId]);
});

// POST update reakcije
app.post('/update_count', (req, res) => {
  const { textId, type } = req.body;
  let reactions = {};
  const content = fs.readFileSync(reactionsFile, 'utf8');
  reactions = content ? JSON.parse(content) : {};
  if (!reactions[textId]) reactions[textId] = { like: 0, hate: 0, confused: 0 };
  reactions[textId][type]++;
  fs.writeFileSync(reactionsFile, JSON.stringify(reactions, null, 2));
  res.json({ success: true, counts: reactions[textId] });
});

app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
