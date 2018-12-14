const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const moment = require('moment');
const app = express();
const xmlParser = require('./server/xml-parser/xml-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static(path.join(__dirname,'/dist')));

app.post('/BDT/api/generatexml', (req,res) => {
    const xml = xmlParser.ParseXML(req.body);

    res.setHeader('Content-Type', 'text/xml');
    res.send(xml);
    return;
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

const port = process.env.PORT || '4201';
app.set('port', port);

app.listen(port);