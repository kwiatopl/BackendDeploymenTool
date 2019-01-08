const express = require('express');
const router = express.Router();
var xmlParser = require('../xml-parser/xml-parser');
var fs = require('fs'); 
var path = require('path');
var xml;

router.post('/generatexml', (req, res) => {
  var zip = new require('node-zip')();
  
  xml = xmlParser.ParseXML(req.body);

  fs.writeFileSync('DeployScriptData.xml', xml, 'binary');

  zip.file('DeployScript.ps1', fs.readFileSync('repo/script/DeployScript.ps1'));
  zip.file('DeployScript.bat', fs.readFileSync('repo/script/DeployScript.bat'));
  zip.file('DeployScriptData.xml', xml);

  var data = zip.generate({ base64:false, compression: 'DEFLATE' });
  
  fs.writeFileSync('DeployScript.zip', data, 'binary');
  
  res.set('Content-Type', 'application/zip');
  res.end(data, 'binary');
  return;
})

module.exports = router;