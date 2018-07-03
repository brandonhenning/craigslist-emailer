const pg = require('pg')

const pool = new pg.Pool({
    user: 'brandonhenning',
    host: '127.0.0.1',
    database: 'scraper',
    password: '123',
    port: '5432'
})

module.exports = pool