var express = require('express');
var app = express();

app.get('/', function (req, res) {
    var options = {
        root: __dirname + '/public/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile('/index.html', options);
});

app.get('/subtitles/:tvshow/:episode', function (req, res) {
    var fs = require('fs');
    var path = require('path');

    var filePath = path.join(__dirname, req.path+"."+req.query.type);
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err){
            res.send(data)
        }else{
            console.log(err);
        }

    });
});

var server = app.listen(1337, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});