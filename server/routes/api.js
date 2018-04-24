const express = require('express');
const router = express.Router();
var xmlParser = require('../xml-parser/xml-parser');
var fs = require('fs'); 
var path = require('path');
var xml;

router.post('/post', (req, res) => {
  xml = xmlParser.ParseXML(req.body);
});

router.get('/download/scriptfiles', (req, res) => {
  var zip = new require('node-zip')();
  fs.writeFileSync('DeployScriptData.xml', xml, 'binary');

  zip.file('DeployScript.ps1', fs.readFileSync('repo/script/DeployScript.ps1'));
  zip.file('DeployScript.bat', fs.readFileSync('repo/script/DeployScript.bat'));
  //zip.file('DeployScriptData.xml', xml);

  var data = zip.generate({ base64:false, compression: 'DEFLATE' });
  
  fs.writeFileSync('DeployScript.zip', data, 'binary');
  
  res.set('Content-Type', 'application/zip');
  res.end(data, 'binary');
  return;
})

module.exports = router;