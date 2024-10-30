const axios = require('axios');

exports.search = async (term) => {
    console.log('Termino de búsqueda:', term);
    try {
        const response = await axios.get('https://itunes.apple.com/search', {
            params: {
                term: term,
                media: 'music',
                limit: 25,
            }
        });

        // Filtro por nombre del artista
        const resultadosFiltrados = response.data.results.filter(c =>
            c.artistName.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 25);

        console.log('Resultados filtrados:', resultadosFiltrados);
        return resultadosFiltrados;
    } catch (error) {
        console.error('Detalles del error:', error.response ? error.response.data : error.message);
        throw new Error('Error obteniendo la data');
    }
};