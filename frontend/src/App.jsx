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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    const [term, setTerm] = useState('');
    const [results, setResults] = useState([]);

    const notify = () => toast("Añadido a favoritos!");

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

    const guardarCancion = async (item) => {
        const { cancion_id, nombre_album } = item; // Asegúrate de que estos campos están en `item`
        const ranking = '5/10'; // Define tu lógica para el ranking, si es necesario
        const usuario = 'usuarioEjemplo'; // Obtén el usuario según tu lógica

        const body = JSON.stringify({
            cancion_id: Number(cancion_id),
            nombre_banda: nombre_album,
            ranking: ranking,
            usuario: usuario
        });

        try {
            const response = await fetch('http://localhost:5000/favoritos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (!response.ok) {
                throw new Error('Error al guardar la canción');
            }

            const data = await response.json();
            alert(data.mensaje || 'Canción guardada correctamente.');
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al guardar la canción. Detalles: ' + error.message);
        }
    };



    return (
        <>
            <div className="container">
                <div className="principal">
                    <ToastContainer
                        autoClose={3000} />
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
                                                    type="button"
                                                    className="btn"
                                                    onClick={() => guardarCancion(item)}
                                                    data-cancion-id={item.cancion_id} // Asumiendo que `cancion_id` está presente en el objeto
                                                    data-nombre-banda={item.nombre_album} // Usando el nombre del álbum como banda
                                                    data-ranking="5/10" // Cambia esto si tienes un ranking dinámico
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
