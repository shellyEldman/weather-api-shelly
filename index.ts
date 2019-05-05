const express = require('express');
const app = express();
const PORT: string|number = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, (): void => {
    console.log('Server is up on port ' + PORT);
});
