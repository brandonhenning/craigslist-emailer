require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fetch = require('node-fetch')
const port = process.env.PORT || 5000
const mailHandler = require('./mailHandler')
const db = require('./database/saveToDatabase')
const craigslist = require('./craigslistHandler')

const app = express()
app.use(cors())
app.use(morgan('tiny'))

db.createTables()



app.get('/search/:location/:searchTerm', (request, response) => {
    scrapeCraigslist(request)
        .then(results => sendEmail(results))
        .then((results) => saveToDatabase(results, request.params))
        .then(results => sendResponse(results, response))
})



function scrapeCraigslist (request) {
    const url = craigslist.getSearchParameters(request)
    return fetch(url)
        .then(response => response.text())
        .then(body => {
            return craigslist.getResults(body)})
}


function sendEmail (results) {
    mailHandler.sendEmail(craigslist.formatResultsToHTML(results))
    return results
}

function saveToDatabase (results, searchObject) {
    db.storeSearch(searchObject.location, searchObject.searchTerm, craigslist.setSearchDate(), 'test@email.net')
    return results
}

function sendResponse (results, response) {
    if (craigslist.checkResponseForListings(results)) {
        response.json({ message: 'Email successfully Sent!'})
    } else {
        response.json({ message: 'No results found, please try again' })
    } return results
}

// function getSearchArray () {
//     return db.getSearches()
// }

// getSearchArray()
//     .then(data => {
//         console.log(data)
//     })

app.use((request, response, next) => {
    const error = new Error('not found')
    response.status(404)
    next(error)
})

app.use((error, request, response, next) => {
    response.status(response.statusCode || 500)
    response.json({
        message: error.message
    })
})

app.listen(port)
