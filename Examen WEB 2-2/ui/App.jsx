import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import JSON from "../data/data.json";
import { patrimony } from '../index.js';
import { MONEY_TYPES } from './components/contants.js';
import Graphique from './components/Graphique';

const TITLE = ["Patrimony", "Money", "Savings Account", "Current Account"];
const FLUX = ["ENTRANT", "SORTANT"];

function Header({ data }) {
    return (
        <header className="header">
        </header>
    );
}

function Sidebar({ data }) {
    return (
        <div className="sidebar">
            <Logo />
            {TITLE.map((title, index) => (
                <div key={index} className="sidebar-card">
                    <p>{title}</p>
                    <h3>
                        <span className="currency-symbol">Ar </span>
                        {matchValueWithTitle(title, data)}
                    </h3>
                </div>
            ))}
        </div>
    );
}

function Logo() {
    return (
        <div className="logo">
        </div>
    );
}

function matchValueWithTitle(title, data) {
    if (title === "Money") return data[0].valeur;
    else if (title === "Savings Account") {
        return sessionStorage.getItem("savingsAccount") || data[1].valeur;
    }
    else if (title === "Current Account") return data[2].valeur;
    else return sessionStorage.getItem("patrimoine") || 0;
}

function Table({ className, data }) {
    const [datas] = useState(data);
    const biensOuFlux = datas.filter(dt => !MONEY_TYPES.includes(dt.type)).sort((data1, data2) => {
        return data1.type.localeCompare(data2.type);
    });

    return (
        <table className={className}>
            <thead>
                <tr>
                    <th>{className.includes("possessions") ? "Possessions" : "Flux"}</th>
                    <th>Valeur</th>
                    <th>Date</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                {biensOuFlux.map((bien, index) => (
                    <TableRow key={index} value={bien} />
                ))}
            </tbody>
        </table>
    );
}

function TableRow({ value }) {
    const styleIn = { color: "rgb(32, 139, 32, .7)" };
    const styleOut = { color: "rgb(177, 36, 36, 0.7)" };
    return (
        <tr>
            <td>{value.libelle}</td>
            <td>{value.valeur.toLocaleString()}</td>
            <td>{value.dateDebut.slice(0, 10)}</td>
            <td style={value.type === "ENTRANT" ? styleIn : styleOut}>{value.type}</td>
        </tr>
    );
}

function Root() {
    const [data, setData] = useState(JSON);
    const [date, setDate] = useState("");
    const [isThereError, setIsThereError] = useState(false);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Value',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    });

    const handleClick = () => {
        if (!isNaN(new Date(date).getDate())) {
            const patrimoineValue = patrimony.getPatrimoineValueAt(date).total;
            sessionStorage.setItem("patrimoine", patrimoineValue);
            sessionStorage.setItem("savingsAccount", patrimony.getPatrimoineValueAt(date).savingsAccount);
            data.push({ patrimoine: patrimoineValue, date: new Date() });

            setChartData(prevData => ({
                labels: [...prevData.labels, date],
                datasets: [{
                    ...prevData.datasets[0],
                    data: [...prevData.datasets[0].data, { x: date, y: patrimoineValue }]
                }]
            }));

            setIsThereError(false);
            setDate("");
        } else {
            setIsThereError(true);
        }
    };

    return (
        <main>
            <Sidebar data={data[1].data.flux} />
            <div className="main-content">
                <Header data={data[1].data.possessions} />
                <nav className="nav">
                    <a href="/flux">Flux</a>
                    <a href="/">Possessions</a>
                    <a>Date du patrimoine : {patrimony.date}</a>
                </nav>
                <div className="date-picker-container">
                    <input 
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <button className="btn" onClick={handleClick}>Valid</button>
                    <p hidden={!isThereError} className="text-danger">Date is invalid</p>
                </div>
                <Graphique data={chartData} />
                <Outlet />
            </div>
        </main>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "",
                element: <Table className="table possessions" data={JSON[1].data.possessions} />
            },
            {
                path: "flux",
                element: <Table className="table flux" data={JSON[1].data.flux} />
            }
        ]
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;