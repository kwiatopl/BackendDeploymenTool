const express = require('express');
const router = express.Router();
var xmlParser = require('../xml-parser/xml-parser');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.post('/post', (req, res) => {
    xmlParser.ParseXML(req.body);
});

module.exports = router;