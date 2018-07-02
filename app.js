const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const port = process.env.PORT || 5000
const mailHandler = require('./mailHandler')
const db = require('./database/saveToDatabase')

const app = express()
app.use(cors())
app.use(morgan('tiny'))

db.createTables()


app.get('/search/:location/:searchTerm', (request, response) => {
    (checkRequestForErrors(request))
    const { location, searchTerm } = request.params
    const url = `https://${location}.craigslist.org/search/sss?query=${searchTerm}`

    fetch(url)
        .then(response => response.text())
        .then(body => {
            const results = getResults(body)
            if (checkResponseForListings(results)) {
                let searchSubject = formatSearchTerm(searchTerm)
                let mailHTML = formatResultsToHTML(results)
                mailHandler.sendEmail(searchSubject, mailHTML)
                db.storeSearch(location, searchTerm, setSearchDate(), 'test@email.net')
                response.json({
                    message: 'Email successfuly sent!'
                })
            } else {
                response.json({
                    message: 'No listings found, please try again.'
                })
            }
        })
})




function getResults (body) {
    const $ = cheerio.load(body)
    const rows = $('li.result-row')
    const results = []
    
    rows.each((index, element) => {
        const result = $(element)
        const link = result.find('.result-title').attr('href')
        const title = result.find('.result-title').text()
        const price = $(result.find('.result-price').get(0)).text()
        const imageData = result.find('a.result-image').attr('data-ids')
        const timePosted = result.find('.result-date').text()
        const images = getImagesIfTheyExist(imageData)
        
        results.push({
            title,
            link,
            price,
            images,
            timePosted
        })
    })
    return results
}

function checkResponseForListings (results) {
    if (results.length === 0) {
        return false
    } else return true
}

function formatSearchTerm (searchTerm) {
    let subject = searchTerm.toLowerCase()
    subject[0].toUpperCase()
    return subject
}

function checkRequestForErrors (request) {
    if (request.params.location && request.params.searchTerm) {
        return request
    }
    else {
        return 'Error, request parameters not formatted correctly, please adjust and resubmit.'
    }
} 

function formatResultsToHTML (results) {
    let bodyOfHTML = '<h1>Listings</h1><br>'
    results.forEach(listing => {
        bodyOfHTML += `<h3>${listing.title}</h3>`
        bodyOfHTML += `<img src="${listing.images[0]}"></img>`
        bodyOfHTML += `<h3>${listing.price}</h3>`
        bodyOfHTML += `<a href>${listing.link}</a>`
    })
    return bodyOfHTML
}


function getImagesIfTheyExist (imageData) {
    if (imageData) {
        const parts = imageData.split(',')
        images = parts.map((id) => {
            return `https://images.craigslist.org/${id.split(':')[1]}_300x300.jpg`
        })
    }
    return images
}

function setSearchDate () {
    return Date().split(' ').slice(1, 4).join(' ')
}


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

