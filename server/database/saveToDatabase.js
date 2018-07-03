const pool = require('./postgresDB')

createTables = async () => {
    try {
        await pool.query('CREATE TABLE IF NOT EXISTS searches(location text, searchTerm text, searchDate date, email text)')
    }
    catch (error) {
        console.log(error, 'Error creating database table')
    }
}

async function storeSearch (location, searchTerm, searchDate, email) {
    try {
        await pool.query(`INSERT INTO searches(location, searchTerm, searchDate, email) VALUES ('${location}', '${searchTerm}', '${searchDate}', '${email}');`, (error, response) => {
            pool.end })
    } catch (error) {
        console.error(error, 'Database insertion formatting error')
    }
}

async function getSearches () {
    try {
        await pool.query(`SELECT email FROM searches ;`, (error, response) => {
            pool.end 
        return response.rows })
    } catch (error) {
        console.error(error, 'Database error: search not formatted correctly')
    }
} 

module.exports = {
    createTables,
    storeSearch,
    getSearches
}

