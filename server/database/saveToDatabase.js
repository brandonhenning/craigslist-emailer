const pool = require('./postgresDB')

function createTables () {
    pool.query('CREATE TABLE IF NOT EXISTS searches(location text, searchTerm text, searchDate date, email text)')
}


function storeSearch (location, searchTerm, searchDate, email) {
    pool.query(`INSERT INTO searches(location, searchTerm, searchDate, email) VALUES ('${location}', '${searchTerm}', '${searchDate}', '${email}');`, (error, response) => {
            pool.end })
}

function getSearches () {
    pool.query(`SELECT email FROM searches ;`, (error, response) => {
        pool.end
        return response.rows })
}

module.exports = {
    createTables,
    storeSearch,
    getSearches
}

