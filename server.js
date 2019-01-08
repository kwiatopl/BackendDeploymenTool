const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
<<<<<<< HEAD
const moment = require('moment');
const app = express();
const xmlParser = require('./server/xml-parser/xml-parser');
=======
const http = require('http');
const app = express();

const api = require('./server/routes/api');
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static(path.join(__dirname,'/dist')));

<<<<<<< HEAD
app.post('/BDT/api/generatexml', (req,res) => {
    const xml = xmlParser.ParseXML(req.body);

    res.setHeader('Content-Type', 'text/xml');
    res.send(xml);
    return;
})
=======
app.use('/api', api);
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

<<<<<<< HEAD
const port = process.env.PORT || '4201';
=======
const port = process.env.PORT || '4200';
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
app.set('port', port);

app.listen(port);