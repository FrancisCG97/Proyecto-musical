// const http = require('http');
// const url = require('url');
// const iTunesController = require('./controllers/iTunesController');

// const PORT = process.env.PORT || 5000;

// const requestHandler = async (req, res) => {
//     const parsedUrl = url.parse(req.url, true);

//     // Configuración de CORS
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//     // Log para depurar
//     console.log('Request received:', req.method, parsedUrl.pathname);

//     // Ruta para buscar en iTunes
//     if (parsedUrl.pathname === '/api/itunes/search' && req.method === 'GET') {
//         const term = parsedUrl.query.term;
//         console.log('Search term:', term);
//         try {
//             const data = await iTunesController.search(term);
//             const top = data.slice(0, 24);
//             console.log('Data fetched successfully');
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(top));
//         } catch (error) {
//             console.error('Error fetching data from iTunes API:', error);
//             res.writeHead(500, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: 'Error fetching data from iTunes API', error: error.message }));
//         }
//     } else {
//         res.writeHead(404, { 'Content-Type': 'text/plain' });
//         res.end('Not Found');
//     }
// };

// // Crear el servidor HTTP
// const server = http.createServer(requestHandler);

// // Iniciar el servidor
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


const http = require('http');
const url = require('url');
const iTunesController = require('./controllers/iTunesController');

const PORT = process.env.PORT || 5000;
const cache = {};
const CACHE_EXPIRATION = 3600 * 1000; // 3600 segundos en milisegundos

const getCachedData = (term) => {
    const cached = cache[term];
    if (cached && (Date.now() - cached.timestamp < CACHE_EXPIRATION)) {
        console.log('Returning cached data for term:', term);
        return cached.data;
    }
    return null;
};

const setCachedData = (term, data) => {
    cache[term] = {
        data,
        timestamp: Date.now()
    };
};

const requestHandler = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Log para depurar
    console.log('Request received:', req.method, parsedUrl.pathname);

    // Ruta para buscar en iTunes
    if (parsedUrl.pathname === '/api/itunes/search' && req.method === 'GET') {
        const term = parsedUrl.query.term;
        console.log('Search term:', term);

        // Verificar si los datos están en caché
        const cachedData = getCachedData(term);
        if (cachedData) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(cachedData));
        }

        // Si no están en caché, realizar la solicitud a iTunes API
        try {
            const data = await iTunesController.search(term);

            // Estructura de respuesta en el formato solicitado
            const albumesUnicos = [...new Set(data.map(c => c.collectionName))];
            const canciones = data.map(c => ({
                cancion_id: c.trackId,
                nombre_album: c.collectionName,
                nombre_tema: c.trackName,
                preview_url: c.previewUrl,
                fecha_lanzamiento: c.releaseDate,
                precio: {
                    valor: c.trackPrice ? c.trackPrice.toString() : "0",
                    moneda: c.currency || "USD"
                }
            }));

            const respuestaFormateada = {
                total_albumes: albumesUnicos.length,
                total_canciones: canciones.length,
                albumes: albumesUnicos,
                canciones: canciones
            };

            // Almacenar en caché la respuesta formateada
            setCachedData(term, respuestaFormateada);

            console.log('Data fetched and cached successfully');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(respuestaFormateada));
        } catch (error) {
            console.error('Error fetching data from iTunes API:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error fetching data from iTunes API', error: error.message }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
};

// Crear el servidor HTTP
const server = http.createServer(requestHandler);

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
