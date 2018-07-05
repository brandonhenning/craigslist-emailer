const cheerio = require('cheerio')

function getResults (body) {
    const $ = cheerio.load(body)
    const rows = $('li.result-row')
    const results = []
    formatResultsRows(results, $, rows)
    return results
}

function formatResultsRows (results, $, rows) {
    rows.each((index, element) => {
        const result = $(element)
        const link = result.find('.result-title').attr('href')
        const title = result.find('.result-title').text()
        const price = $(result.find('.result-price').get(0)).text()
        const imageData = result.find('a.result-image').attr('data-ids')
        const timePosted = result.find('.result-date').text()
        const images = getImagesIfTheyExist(imageData)
        pushResultsAsList(results, title, link, price, images, timePosted)
    })
}

function pushResultsAsList (results, title, link, price, images, timePosted) {
    results.push({ title, link, price, images,timePosted })
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
    } return images
}

function setSearchDate () {
    return Date().split(' ').slice(1, 4).join(' ')
}

module.exports = {
    getResults,
    formatResultsToHTML,
    formatResultsRows,
    pushResultsAsList,
    checkResponseForListings,
    formatSearchTerm,
    checkRequestForErrors,
    getImagesIfTheyExist,
    setSearchDate
}