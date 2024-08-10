// server.js (ou app.js)
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.json());

const dataFilePath = path.join(__dirname, 'data.json');

// Lire les données
app.get('/data', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(JSON.parse(data));
  });
});

// Écrire les données
app.post('/data', (req, res) => {
  const newData = req.body;
  fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Data updated successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
