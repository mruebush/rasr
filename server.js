var express = require('express');
var app = express();
// app.use(require('body-parser')());
// var fs = require('fs');

var path = require('path');

app.use('/assets', express.static(path.resolve(__dirname + '/public/assets')));
app.use('/bower_components', express.static(path.resolve(__dirname + '/public/bower_components')));
app.use('/js', express.static(path.resolve(__dirname + '/public/js')));
app.use('/fonts', express.static(path.resolve(__dirname + '/public/fonts')));
app.use('/styles', express.static(path.resolve(__dirname + '/public/styles')));
app.use('/mocks', express.static(path.resolve(__dirname + '/public/mocks')));
app.use('/node_modules', express.static(path.resolve(__dirname + '/node_modules')));

// app.post('/tileset/save', function(req, res, next) {
//   var name = req.body.data.name;
//   var data = req.body.data.base64;
//   console.log('req: ', name);
//   var imageBuffer = decodeBase64Image(data);
//   fs.writeFile('public/assets/tilemaps/tiles/' + name, imageBuffer.data, function(err) {
//     if(err) console.log('err: ', err);
//   });

// });

// var decodeBase64Image = function(dataString) {
//   var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
//     response = {};

//   if (matches.length !== 3) {
//     return new Error('Invalid input string');
//   }

//   response.type = matches[1];
//   response.data = new Buffer(matches[2], 'base64');

//   return response;
// };



app.get( '/*', function( req, res, next ) {
  res.sendfile(path.resolve(__dirname + '/public/index.html'));
});

app.listen(process.env.PORT || 9000);
