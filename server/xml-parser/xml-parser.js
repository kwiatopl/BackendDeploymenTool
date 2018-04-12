function XMLParser(){};

XMLParser.prototype.ParseXML = function(data) {    
    console.log(data[0]);
    var builder = require('xmlbuilder');
    var xml = builder.create('BackendDeployScript', { encoding: 'utf-8' }).attribute({ Name: 'BackEndDeployScript' });
    for(let i = 0; i < data[0].length; i++) {
        //Content Sources
        let priority;
        let lobSystemDict = [];

        if( data[0][i].Priority == "Normal" ) { this.priority = 1 }
        else if( data[0][i].Priority == "High") { this.priority = 2 }
        else { this.priority = undefined };

        if(data[0][i].LOBSystem) {
            let lobSystemName;
            let lobSystemValue;

            data[0][i].LOBSystem = data[0][i].LOBSystem.replace(/\s+/g, '');

            this.lobSystemName = data[0][i].LOBSystem.split(";");
            
            this.lobSystemName.forEach( el => {
                if(el && el !== " ") {
                    lobSystemValue = el.split(",");
                    lobSystemDict.push({
                        key: lobSystemValue[0],
                        value: lobSystemValue[1]
                    });
                }
            })
        }        

        var contentSource = xml.node('ContentSource')
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

        var lobSystemSetList = contentSource.ele('LOBSystemSetList');
        lobSystemDict.forEach( el => {
            lobSystemSetList.ele('LOBSystemSet')
                .ele('LOBSystemName', el.key).up()
                .ele('LOBSystemInstanceName', el.value).up()
            .up()
        })
    }

    var crawlRuleList = xml.node('CrawlRulesList');
    
    for(let i = 0; i < data[1].length; i++) {
        //Crawl Rules
        let accessMethod;
        if( data[1][i].AccessMethod === "Default") { this.accessMethod = "DefaultRuleAccess"};
        crawlRuleList.ele('CrawlRule')
        .ele("Path", data[1][i].Name).up()
        .ele("SearchApplication", data[1][i].Ssa).up()
        .ele("Type", data[1][i].Rule).up()
        .ele("AccountName").up()
        .ele("AccountPassword").up()
        .ele("AuthenticationType", this.accessMethod).up()
        .ele("CrawlAsHTTP", data[1][i].CrawlAsHttp ? 1 : 0).up()
        .ele("FollowComplexURLs", data[1][i].CrawlComplexUrls ? 1 : 0).up()
        .ele("IsAdvancedRegularExpression", data[1][i].Regex ? 1 : 0).up()
        .ele("Priority", data[1][i].Priority).up()
        .ele("SuppressIndexing", data[1][i].FollowLinks ? 1 : 0).up()
    }

    xml.node('SearchSchema');

    console.log(xml.end({ pretty: true }));
}

module.exports = new XMLParser;

