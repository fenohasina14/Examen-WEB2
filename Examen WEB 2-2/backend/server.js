const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let possessions = [
    { libelle: 'House', valeur: 200000, dateDebut: '2023-01-01', taux: 1.5 },
    { libelle: 'Car', valeur: 20000, dateDebut: '2023-02-01', taux: 2.0 }
];

app.get('/possession', (req, res) => {
    res.json(possessions);
});

app.post('/possession', (req, res) => {
    const newPossession = req.body;
    possessions.push(newPossession);
    res.status(201).json(newPossession);
});

app.put('/possession/:libelle', (req, res) => {
    const { libelle } = req.params;
    const { dateFin } = req.body;
    const possession = possessions.find(p => p.libelle === libelle);
    if (possession) {
        possession.dateFin = dateFin;
        res.json(possession);
    } else {
        res.status(404).send('Possession not found');
    }
});

app.post('/possession/:libelle/close', (req, res) => {
    const { libelle } = req.params;
    const index = possessions.findIndex(p => p.libelle === libelle);
    if (index !== -1) {
        possessions[index].dateFin = new Date().toISOString().split('T')[0];
        res.json(possessions[index]);
    } else {
        res.status(404).send('Possession not found');
    }
});

app.get('/patrimoine/:date', (req, res) => {
    const { date } = req.params;
    const valeurPatrimoine = calculatePatrimoineAt(date);
    res.json({ valeur: valeurPatrimoine });
});

app.post('/patrimoine/range', (req, res) => {
    const { type, dateDebut, dateFin, jour } = req.body;
    const valeurPatrimoine = calculatePatrimoineRange(type, dateDebut, dateFin, jour);
    res.json({ valeur: valeurPatrimoine });
});

function calculatePatrimoineAt(date) {
    // Implement your calculation logic here
    return 0; // Example value
}

function calculatePatrimoineRange(type, dateDebut, dateFin, jour) {
    // Implement your calculation logic here
    return 0; // Example value
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.post('/possession', (req, res) => {
    const newPossession = req.body;
    possessions.push(newPossession);
    res.status(201).json(newPossession);
});
