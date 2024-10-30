import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    const [term, setTerm] = useState('');
    const [results, setResults] = useState([]);

    const notify = () => toast("Canción añadida a favoritos!");

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/itunes/search?term=${term}`);
            const data = await response.json();
            console.log('Data obtenida:', data);

            if (data && Array.isArray(data.canciones)) {
                setResults(data.canciones);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Error obteniendo la data:", error);
            setResults([]);
        }
    };

    return (
        <>
            <div className="container">
                <div className="principal">
                    <ToastContainer
                        autoClose={3000}
                    />
                    <h1 className="text-center">Búsqueda musical</h1>
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => setTerm(e.target.value)}
                                    placeholder="Ingrese el nombre de un artista o banda"
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={handleSearch}
                                    type="button"
                                    id="button-addon2"
                                >
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    {results.length ? (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table">
                                    <tr>
                                        <th></th>
                                        <th>Nombre de la canción</th>
                                        <th>Nombre del disco</th>
                                        <th>Url preview</th>
                                        <th>Precio</th>
                                        <th>Fecha de lanzamiento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <button
                                                    id='cancion'
                                                    type="button"
                                                    className="btn"
                                                    onClick={() => {
                                                        notify();
                                                    }}
                                                >
                                                    ❤️
                                                </button>
                                            </td>
                                            <td>{item.nombre_tema}</td>
                                            <td>{item.nombre_album}</td>
                                            <td><a href={item.preview_url} target="_blank" rel="noopener noreferrer">Preview</a></td>
                                            <td>{item.precio.valor} {item.precio.moneda}</td>
                                            <td>{new Date(item.fecha_lanzamiento).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center mt-4">
                            <p>No se encontraron resultados.</p>
                        </div>
                    )}
                </div>

            </div>

        </>
    );
}

export default App;
