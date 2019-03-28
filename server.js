import http from 'http'
import url from 'url'
import fs from 'fs'
import path from 'path'



// const http = require('http')
// const url = require('url')
// const fs = require('fs')
// const path = require('path')


const port = process.argv[2] || 8000

const fileType = {
    '.ico'  : 'image/x-icon',
    '.html' : 'text/html',
    '.js'   : 'text/javascript',
    '.json' : 'application/json',
    '.css'  : 'text/css',
    '.png'  : 'image/png',
    '.jpeg' : 'image/jpeg',
    '.wav'  : 'audio/wav',
    '.mp3'  : 'audio/mpeg',
    '.svg'  : 'image/svg+xml',
    '.pdf'  : 'application/pdf',
    '.doc'  : 'application/msword',
    'eot'   : 'application/vnd.ms-fontobject',
    'ttf'   : 'application/font-sfnt'
}



http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`)

    // parse URL
    const parsedUrl = url.parse(req.url)

    // prevent directory traversal
    //https://en.wikipedia.org/wiki/Directory_traversal_attack
    const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/,'')
    // console.log(__dirname)
    let pathName = path.join(__dirname, sanitizePath)

    fs.exists(pathName, function(exist){
        if(!exist){
            // respond 404 not found
            res.statusCode = 404
            res.end(`File ${pathName} not found`)
            return
        }
        // if is a directory and look for index.html
        if (fs.statSync(pathName).isDirectory()) pathName += '/index.html'
        // read file
        fs.readFile(pathName, function(err, data) {
            if(err) {
                res.statusCode = 500
                res.end(`Error getting the file.`)
                console.log(`Error getting the file. ${err}`)
            } else {
                // based on file url path, extract data from file
                let ext = path.parse(pathName).ext
                // if file is found, set content type and send data
                res.setHeader('Content-type', fileType[ext] || 'text/html')
                res.end(data)
            }
        })
    })  
}).listen(parseInt(port))

console.log(`Server is listening on port ${port}`)