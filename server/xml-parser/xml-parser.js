function XMLParser(){};

XMLParser.prototype.ParseXML = function(data) {    
    console.log(data[0]);
    var builder = require('xmlbuilder');
    var xml = builder.create('BackendDeployScript', { encoding: 'utf-8' }).attribute({ Name: 'BackEndDeployScript' });
    for(let i = 0; i < data[0].length; i++) {
        //Content Sources
        let priority;
        if( data[0][i].Priority == "Normal" ) { this.priority = 1 }
        else if( data[0][i].Priority == "High") { this.priority = 2 }
        else { this.priority = undefined }

        xml.node('ContentSource')
        .attribute({ Name: data[0][i].Name })
        .ele('SearchApplication', data[0][i].Ssa).up()
        .ele('Type', data[0][i].Type).up()
        .ele('StartAdresses', data[0][i].Address).up()
        .ele('CrawlSettings')
            .ele('ContinuousCrawl', data[0][i].Continuous ? 1 : 0).up()
            .ele('SharepointCrawlBehavior', data[0][i].Behavior).up()
            .ele('CrawlPriority', this.priority).up()
        .up()
        .ele('MaxSiteEnumerationDepth', data[0][i].SiteEnumeration).up()
        .ele('MaxPageEnumerationDepth', data[0][i].PageEnumeration).up()
        .ele('BDCApplicationProxyGroup', data[0][i].Proxy).up()
        .ele('CrawlScheduleList').up()
        .ele('LOBSystemSetList', data[0][i].LOBSystem).up()
    }

    xml.node('CrawlRulesList');
    
    for(let i = 0; i < data[1].length; i++) {
        //Crawl Rules

    }

    xml.node('SearchSchema');

    console.log(xml.end({ pretty: true }));
}

module.exports = new XMLParser;

