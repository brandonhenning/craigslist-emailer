const pool = require('./postgresDB')

function createTables () {
    return pool.query('CREATE TABLE IF NOT EXISTS searches(location text, searchTerm text, searchDate date, email text, wantsToBeEmailed boolean)')
}


function storeSearch (location, searchTerm, searchDate, email, wantstoBeEmailed) {
    return pool.query(`INSERT INTO searches(location, searchTerm, searchDate, email, wantsToBeEmailed) VALUES ('${location}', '${searchTerm}', '${searchDate}', '${email}', '${wantstoBeEmailed}');`)
}

function getSearches () {
    return pool.query(`SELECT email FROM searches ;`)
    .then(response => {
        console.log(response.rows)    
        return response.rows
    })
}

module.exports = {
    createTables,
    storeSearch,
    getSearches
}

