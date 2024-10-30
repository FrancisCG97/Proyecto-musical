// import React, { useState } from 'react';
// import './App.css';

// function App() {
//     const [term, setTerm] = useState('');
//     const [results, setResults] = useState([]);

//     const handleSearch = async () => {
//         try {
//             const response = await fetch(`http://localhost:5000/api/itunes/search?term=${term}`);
//             const data = await response.json();
//             // const top = data.slice(0, 24);
//             console.log('Data fetched:', data); // Verifica la estructura de la respuesta

//             if (data && Array.isArray(data.results)) { // Asegúrate de que results es un array
//                 setResults(data.results);
//             } else {
//                 setResults([]); // Si results no es un array, establece como vacío
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setResults([]); // Maneja el error
//         }
//     };

//     return (
//         <>
//             <div className='principal'>
//                 <h1>Búsqueda musical</h1>
//                 <div className="input-group">
//                     <input
//                         type="text"
//                         className="form-control"
//                         onChange={(e) => setTerm(e.target.value)}
//                         placeholder="Ingrese el nombre de un artista o banda"
//                     />
//                     <button
//                         className="btn btn-outline-primary"
//                         onClick={handleSearch}
//                         type="button"
//                         id="button-addon2"
//                     >
//                         Buscar
//                     </button>
//                 </div>
//             </div>
//             <div>
//                 {results.length ? (
//                     <table className="table table-striped">
//                         <thead>
//                             <tr>
//                                 <th>Nombre de la canción</th>
//                                 <th>Nombre del disco</th>
//                                 <th>Url preview</th>
//                                 <th>Precio</th>
//                                 <th>Fecha de lanzamiento</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {results
//                                 .filter(item => item.artistName.toLowerCase() === term.toLowerCase())
//                                 .map((item, index) => (
//                                     <tr key={index}>
//                                         <td>{item.trackName}</td>
//                                         <td>{item.collectionName}</td>
//                                         <td>{item.previewUrl}</td>
//                                         <td>{item.trackprice}</td>
//                                         <td>{item.releaseDate}</td>
//                                     </tr>
//                                 ))}
//                         </tbody>
//                     </table>
//                 ) : (
//                     <div>
//                         <p>No results found.</p>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// }

// export default App;


import React, { useState } from 'react';
import './App.css';

function App() {
    const [term, setTerm] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/itunes/search?term=${term}`);
            const data = await response.json();
            console.log('Data fetched:', data); // Verifica la estructura de la respuesta

            // Asegúrate de que data.canciones es un array antes de establecer los resultados
            if (data && Array.isArray(data.canciones)) {
                setResults(data.canciones);
            } else {
                setResults([]); // Si canciones no es un array, establece como vacío
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setResults([]); // Maneja el error
        }
    };

    return (
        <>
            <div className="container">
                <div className="principal">
                    <h1 className="text-center">Búsqueda musical</h1>
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-10">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => setTerm(e.target.value)}
                                    placeholder="Ingrese el nombre de un artista o banda"
                                />
                                <button
                                    className="btn btn-outline-primary"
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
