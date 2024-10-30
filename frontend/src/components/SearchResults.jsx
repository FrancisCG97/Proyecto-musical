import React from 'react';

function SearchResults({ results = [] }) {

    return (
        <>
            {/* {results.length ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Track/Collection Name</th>
                            <th>Artist</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results
                            .slice(0, 25) // Limitar a los primeros 25
                            .map((item, index) => (
                                <tr key={index}>
                                    <td>{item.trackName || item.collectionName}</td>
                                    <td>{item.artistName}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            ) : (
                <p>No results found.</p>
            )} */}

        </>
    );
}


export default SearchResults;