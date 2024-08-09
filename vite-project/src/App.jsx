import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import './App.css';
import Argent from './components/Argent';
import Patrimoine from './components/Patrimoine';
import Personne from './components/Personne';
import data from'./data/data.json';

function App() {
  const [data, setData] = useState([
    {
      libelle: 'Exemple 1',
      valeurInitiale: '1000',
      dateDebut: '2022-01-01',
      dateFin: '2023-01-01',
      amortissement: '200',
      valeurActuelle: '800'
    }
  ]);

  const [additionalDate, setAdditionalDate] = useState('');
  const [result, setResult] = useState(null);
  const [historique, setHistorique] = useState([]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newData = [...data];
    newData[index][name] = value;
    setData(newData);
  };

  const calculateValues = (date) => {
    const parsedDate = new Date(date);

    const personne = new Personne('John Doe');
    const possessions = data.map(row => {
      const { libelle, valeurInitiale, dateDebut, dateFin, amortissement } = row;
      return new Argent(personne, libelle, parseNumber(valeurInitiale), new Date(dateDebut), new Date(dateFin), parseNumber(amortissement), 'Courant');
    });
    const patrimoine = new Patrimoine(personne, possessions);

    const valeurs = possessions.map(possession => ({
      libelle: possession.libelle,
      valeur: Math.max(possession.getValeur(parsedDate), 0).toFixed(2) + ' €'
    }));

    return valeurs;
  };

  const handleDateSubmit = () => {
    if (!additionalDate) {
      alert('Veuillez sélectionner une date.');
      return;
    }

    const valeurs = calculateValues(additionalDate);
    const updatedData = data.map((row, index) => ({
      ...row,
      valeurActuelle: valeurs[index] ? valeurs[index].valeur : row.valeurActuelle
    }));

    setData(updatedData);
    setResult(valeurs);

   
    setHistorique(prevHistorique => [
      ...prevHistorique,
      { date: additionalDate, valeurs }
    ].reverse());
  };

  const parseNumber = (value) => {
    const number = parseFloat(value.replace(' €', '').replace(',', '.'));
    return isNaN(number) ? 0 : number;
  };

  const tableStyle = {
    border: '2px solid #000',
    backgroundColor: '#d4edda',
    width: '100%',
    borderCollapse: 'collapse'
  };

  const cellStyle = {
    border: '2px solid #000',
    padding: '8px',
    textAlign: 'left'
  };

  const headerStyle = {
    backgroundColor: '#c3e6cb'
  };

  const formStyle = {
    margin: '20px 0'
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '900px' }}>
      <h1 className="mb-4 text-center">Tableau des Amortissements</h1>
      
      <Table style={tableStyle} striped bordered hover>
        <thead>
          <tr>
            <th style={headerStyle}>Libellé</th>
            <th style={headerStyle}>Valeur Initiale</th>
            <th style={headerStyle}>Date Début</th>
            <th style={headerStyle}>Date Fin</th>
            <th style={headerStyle}>Amortissement</th>
            <th style={headerStyle}>Valeur Actuelle</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td style={cellStyle}>
                <Form.Control
                  type="text"
                  name="libelle"
                  value={row.libelle}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td style={cellStyle}>
                <Form.Control
                  type="text"
                  name="valeurInitiale"
                  value={row.valeurInitiale}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td style={cellStyle}>
                <Form.Control
                  type="date"
                  name="dateDebut"
                  value={row.dateDebut}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td style={cellStyle}>
                <Form.Control
                  type="date"
                  name="dateFin"
                  value={row.dateFin}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td style={cellStyle}>
                <Form.Control
                  type="text"
                  name="amortissement"
                  value={row.amortissement}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td style={cellStyle}>
                <Form.Control
                  type="text"
                  name="valeurActuelle"
                  value={row.valeurActuelle}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div style={formStyle}>
        <Form.Group controlId="formAdditionalDate">
          <Form.Label>Date Picker</Form.Label>
          <Form.Control
            type="date"
            value={additionalDate}
            onChange={(e) => setAdditionalDate(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleDateSubmit}>
          Soumettre
        </Button>
      </div>

      {result && (
        <div className="mt-4">
          <h3>Résultat du Calcul</h3>
          <ul>
            {result.map((item, index) => (
              <li key={index}>
                {item.libelle}: {item.valeur}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <h3>Historique des Calculs</h3>
        <Table style={tableStyle} striped bordered hover>
          <thead>
            <tr>
              <th style={headerStyle}>Date</th>
              <th style={headerStyle}>Libellé</th>
              <th style={headerStyle}>Valeur</th>
            </tr>
          </thead>
          <tbody>
            {historique.map((entry, index) => (
              entry.valeurs.map((item, idx) => (
                <tr key={`${index}-${idx}`}>
                  {idx === 0 && (
                    <td rowSpan={entry.valeurs.length} style={cellStyle}>{entry.date}</td>
                  )}
                  <td style={cellStyle}>{item.libelle}</td>
                  <td style={cellStyle}>{item.valeur}</td>
                </tr>
              ))
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default App;
