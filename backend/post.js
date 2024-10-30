const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 5000;
const favoritos = []; // Arreglo temporal para almacenar canciones favoritas

const requestHandler = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log('Petición recibida:', req.method, parsedUrl.pathname);

    // Ruta 
    if (parsedUrl.pathname === '/favoritos' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { favorito } = JSON.parse(body);

            if (!favorito || typeof favorito !== 'string') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'El campo "favorito" es obligatorio y debe ser una cadena.' }));
            }

            const informacion = favorito.map(c => ({
                cancion_id: c.trackId,
                nombre_tema: c.trackName,
                usuario: 'Francis',
                Ranking: '5/10',
            }));

            favoritos.push(informacion);
            console.log('Favorito añadido:', informacion);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Canción guardada correctamente.' }));
        });

    } else if (parsedUrl.pathname === '/favoritos' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(favoritos));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('No encontrado');
    }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`Server andando en el puerto: ${PORT}`);
});
