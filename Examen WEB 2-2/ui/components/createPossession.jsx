import React, { useState } from 'react';

function CreatePossession({ onAdd }) {
    const [libelle, setLibelle] = useState('');
    const [valeur, setValeur] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [taux, setTaux] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newPossession = {
            libelle,
            valeur: parseFloat(valeur),
            dateDebut,
            taux: parseFloat(taux)
        };

        try {
            const response = await fetch('http://localhost:3000/possession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPossession)
            });

            if (response.ok) {
                const data = await response.json();
                onAdd(data);
                setLibelle('');
                setValeur('');
                setDateDebut('');
                setTaux('');
            } else {
                console.error('Failed to create possession');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-possession-form">
            <h2>Ajouter une Possession</h2>
            <label>
                Libellé:
                <input
                    type="text"
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    required
                />
            </label>
            <label>
                Valeur:
                <input
                    type="number"
                    value={valeur}
                    onChange={(e) => setValeur(e.target.value)}
                    required
                />
            </label>
            <label>
                Date de Début:
                <input
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    required
                />
            </label>
            <label>
                Taux:
                <input
                    type="number"
                    step="0.01"
                    value={taux}
                    onChange={(e) => setTaux(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Ajouter</button>
        </form>
    );
}

export default CreatePossession;
