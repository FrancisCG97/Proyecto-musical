const http = require('http');
const url = require('url');
const iTunesController = require('./controllers/controladorITunes');

const PORT = process.env.PORT || 5000;

const requestHandler = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log('Request received:', req.method, parsedUrl.pathname);

    // Ruta 
    if (parsedUrl.pathname === '/api/itunes/search' && req.method === 'GET') {
        const term = parsedUrl.query.term;
        console.log('Search term:', term);

        try {
            const data = await iTunesController.search(term);

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

            console.log('Response structure:', JSON.stringify(respuestaFormateada, null, 2));

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

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
