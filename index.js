var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile('index.html');
});
app.get('*', function (req, res) {
    res.redirect('/');
});
app.listen(PORT, function () {
    console.log('Server is up on port ' + PORT);
});
