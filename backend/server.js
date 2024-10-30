const http = require('http');
const url = require('url');
const iTunesController = require('./controllers/iTunesController');

const PORT = process.env.PORT || 5000;
const favoritos = []; 

const requestHandler = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Log para depurar
    console.log('Request received:', req.method, parsedUrl.pathname);

    // Ruta para marcar canción como favorita
    if (parsedUrl.pathname === '/favoritos' && req.method === 'POST') {
        let body = '';

        // Leer los datos de la solicitud
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // Parsear JSON del cuerpo
            const { nombre_banda, cancion_id, usuario, ranking } = JSON.parse(body);

            // Validación de datos
            if (!nombre_banda || !cancion_id || !usuario || !ranking) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Todos los campos son obligatorios.' }));
            }

            if (typeof cancion_id !== 'number') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'cancion_id debe ser un número.' }));
            }

            if (!/^\d+\/\d+$/.test(ranking)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Ranking debe estar en formato x/x.' }));
            }

            // Verificar si la canción y la banda existen en el caché (sin caché)
            const cancionExiste = favoritos.some(cancion =>
                cancion.cancion_id === cancion_id && cancion.nombre_banda.includes(nombre_banda)
            );

            if (!cancionExiste) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'La banda o la canción no existe.' }));
            }

            // Almacenar la canción en favoritos
            favoritos.push({ nombre_banda, cancion_id, usuario, ranking });
            console.log('Canción añadida a favoritos:', { nombre_banda, cancion_id, usuario, ranking });

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Canción marcada como favorita correctamente.' }));
        });

    // Ruta para buscar en iTunes
    } else if (parsedUrl.pathname === '/api/itunes/search' && req.method === 'GET') {
        const term = parsedUrl.query.term;
        console.log('Search term:', term);

        // Realizar la solicitud a iTunes API
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

            // Imprimir la respuesta formateada en consola
            console.log('Response structure:', JSON.stringify(respuestaFormateada, null, 2));

            // Enviar respuesta al cliente
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
