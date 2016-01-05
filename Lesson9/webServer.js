var express = require('express')
var serveStatic = require('serve-static')
var contentDir = __dirname + '/pages';

var app = express()

app.use(serveStatic(contentDir))
console.log('Starting MyStoreServer [Lesson 08] at http://localhost:3000/');
app.listen(3000)

