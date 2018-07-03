const pool = require('./postgresDB')

function createTables () {
    return pool.query('CREATE TABLE IF NOT EXISTS searches(location text, searchTerm text, searchDate date, email text)')
}


function storeSearch (location, searchTerm, searchDate, email) {
    return pool.query(`INSERT INTO searches(location, searchTerm, searchDate, email) VALUES ('${location}', '${searchTerm}', '${searchDate}', '${email}');`)
}

function getSearches () {
    return pool.query(`SELECT email FROM searches ;`)
    .then(response => {    
        return response.rows
    })
}

module.exports = {
    createTables,
    storeSearch,
    getSearches
}

