const axios = require('axios');

exports.search = async (term) => {
    console.log('Search term:', term); // Verifica el término de búsqueda
    try {
        const response = await axios.get('https://itunes.apple.com/search', {
            params: {
                term: term,
                media: 'music',
                limit: 25,
            }
        });

        // Filtra solo las canciones del artista con coincidencia parcial
        const resultadosFiltrados = response.data.results.filter(c =>
            c.artistName.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 25);

        console.log('Filtered results:', resultadosFiltrados);
        return resultadosFiltrados;
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching data from iTunes API');
    }
};


// const axios = require('axios');

// exports.search = async (term) => {
//     console.log('Search term:', term);
//     try {
//         const response = await axios.get('https://itunes.apple.com/search', {
//             params: {
//                 term: term,
//                 media: 'music',
//                 limit: 25,
//             }
//         });

//         // Filtra solo las canciones del artista y organiza los datos
//         const resultadosFiltrados = response.data.results.filter(c =>
//             c.artistName.toLowerCase().includes(term.toLowerCase())
//         );

//         // Obtener álbumes únicos
//         const albumesUnicos = [...new Set(resultadosFiltrados.map(c => c.collectionName))];

//         // Construye el objeto de respuesta en el formato requerido
//         const canciones = resultadosFiltrados.map(c => ({
//             cancion_id: c.trackId,
//             nombre_album: c.collectionName,
//             nombre_tema: c.trackName,
//             preview_url: c.previewUrl,
//             fecha_lanzamiento: c.releaseDate,
//             precio: {
//                 valor: c.trackPrice ? c.trackPrice.toString() : "0",
//                 moneda: c.currency || "USD"
//             }
//         }));

//         const resultadoFinal = {
//             total_albumes: albumesUnicos.length,
//             total_canciones: canciones.length,
//             albumes: albumesUnicos,
//             canciones: canciones
//         };

//         console.log('Formatted results:', resultadoFinal);
//         return resultadoFinal;
//     } catch (error) {
//         console.error('Error details:', error.response ? error.response.data : error.message);
//         throw new Error('Error fetching data from iTunes API');
//     }
// };
