function XMLParser(){};

XMLParser.prototype.ParseXML = function(data) {
        var builder = require('xmlbuilder');
        var xml = builder.create('BackendDeployScript', { encoding: 'utf-8' }).attribute({ Name: 'BackEndDeployScript' });
<<<<<<< HEAD
=======
        var runCrawl = 0;
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6

        for (let i = 0; i < data[0].length; i++) {
            //Content Sources
            let priority;
            let lobSystemDict = [];
<<<<<<< HEAD
            
            if (data[0][i].Priority == "Normal") {
                priority = 1;
            }
            else if (data[0][i].Priority == "High") {
=======
            runCrawl = 1;
            
            if (data[0][i].Priority == "Normal") {
                priority = 1;
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
                priority = 2;
            }
            else {
                priority = undefined;
            };
            
            if (data[0][i].LOBSystem) {
                let lobSystemName;
                let lobSystemValue;
                data[0][i].LOBSystem = data[0][i].LOBSystem.replace(/\s+/g, '');
                lobSystemName = data[0][i].LOBSystem.split(";");
                lobSystemName.forEach(el => {
                    if (el && el !== " ") {
                        lobSystemValue = el.split(",");
                        lobSystemDict.push({
                            key: lobSystemValue[0],
                            value: lobSystemValue[1]
                        });
                    };
                });
            };
            
            var contentSource = xml.node('ContentSource')
                .attribute({ Name: data[0][i].Name })
                .ele('SearchApplication', data[0][i].Ssa).up()
                .ele('Type', data[0][i].Type).up()
                .ele('StartAddresses', data[0][i].Address).up()
                .ele('CrawlSettings')
                .ele('ContinuousCrawl', data[0][i].Continuous ? 1 : 0).up()
                .ele('SharepointCrawlBehavior', data[0][i].Behavior).up()
                .ele('CrawlPriority', priority).up()
                .up()
                .ele('MaxSiteEnumerationDepth', data[0][i].SiteEnumeration).up()
                .ele('MaxPageEnumerationDepth', data[0][i].PageEnumeration).up()
                .ele('BDCApplicationProxyGroup', data[0][i].Proxy).up()
                .ele('CrawlScheduleList').up();

            var lobSystemSetList = contentSource.ele('LOBSystemSetList');

            lobSystemDict.forEach(el => {
                lobSystemSetList.ele('LOBSystemSet')
                    .ele('LOBSystemName', el.key).up()
                    .ele('LOBSystemInstanceName', el.value).up()
                    .up();
            });
        }
<<<<<<< HEAD
=======

        var crawlRuleList = xml.node('CrawlRulesList');
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
        
        for (let i = 0; i < data[1].length; i++) {
            //Crawl Rules
            let accessMethod;
            let rule;
            let complexUrls;
<<<<<<< HEAD
=======
            runCrawl = 1;
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6

            if (data[1][i].AccessMethod) {
                accessMethod = "DefaultRuleAccess";
            };
            
            if(data[1][i].Rule == "Exclude") {
                rule = "ExclusionRule";
            }

            if(data[1][i].CrawlComplexUrls || data[1][i].ExcludeComplexUrls) {
                complexUrls = 1;
            }

            if(data[1][i].Rule == "Include") {
                rule = "InclusionRule";
            }

<<<<<<< HEAD
            xml.node('CrawlRule')
                .attribute({ Path: data[1][i].Name })
=======
            crawlRuleList.ele('CrawlRule')
                .ele("Path", data[1][i].Name).up()
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
                .ele("SearchApplication", data[1][i].Ssa).up()
                .ele("Type", rule).up()
                .ele("AccountName").up()
                .ele("AccountPassword").up()
                .ele("AuthenticationType", accessMethod).up()
                .ele("CrawlAsHTTP", data[1][i].CrawlAsHttp ? 1 : 0).up()
                .ele("FollowComplexURLs", complexUrls).up()
                .ele("IsAdvancedRegularExpression", data[1][i].Regex ? 1 : 0).up()
                .ele("Priority", data[1][i].Priority).up()
                .ele("SuppressIndexing", data[1][i].FollowLinks ? 1 : 0).up();
        }
<<<<<<< HEAD
=======

        var SearchSchemaList = xml.node('SearchSchema');
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
        
        for (let i = 0; i < data[2].length; i++) {
            //Search Schema
            let refinable = 0;
            let sortable = 0;
            let refinableType;
            let sortableType;
            let type;
<<<<<<< HEAD
=======
            runCrawl = 1;
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6

            switch(data[2][i].Type) {
                case 'Text': 
                    type = 1;
                    break;
                case 'Integer':
                    type = 2;
                    break;
                case 'Decimal':
                    type = 3;
                    break;
                case 'DateTime':
                    type = 4;
                    break;
                case 'Boolean':
                    type = 5;
                    break;
                case 'Binary':
                    type = 6;
                    break;
                case 'DoubleFloat':
                    type = 7;
                    break;
            }

            if(!data[2][i].OnlyMapping) {
                if (data[2][i].Refinable.toString()) {
                    if(data[2][i].Refinable.toString() === "No") { refinable = 0; refinableType = "Shallow" }
                    else if(data[2][i].Refinable.toString() === "Latent") { refinable = 1; refinableType = "Latent" }
                    else if(data[2][i].Refinable.toString() === "Active") { refinable = 1; refinableType = "Deep" }
                };

                if (data[2][i].Sortable.toString()) {
<<<<<<< HEAD
                    if(data[2][i].Sortable.toString() === "No") { sortable = 0; sortableType = "" }
                    else if(data[2][i].Sortable.toString() === "Latent") { sortable = 1; sortableType = "Latent" }
                    else if(data[2][i].Sortable.toString() === "Active") { sortable = 1; sortableType = "Enabled" }
                };
            }

            var searchschema = xml.node('ManagedProperty')
=======
                    if(data[2][i].Sortable.toString() === "No") { sortable = 0; sortableType = "Shallow" }
                    else if(data[2][i].Sortable.toString() === "Latent") { sortable = 1; sortableType = "Latent" }
                    else if(data[2][i].Sortable.toString() === "Active") { sortable = 1; sortableType = "Deep" }
                };
            }

            var searchschema = SearchSchemaList.node('ManagedProperty')
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
                .attribute({ Name: data[2][i].Name })
                .ele('SearchApplication', data[2][i].Ssa).up()
                .ele('OnlyCrawledProperties', data[2][i].OnlyMapping ? 1 : 0).up()
                .ele('Description', data[2][i].Description).up()
                .ele('Type', type).up()
                .ele('EnabledForScoping').up()
                .ele('FullTextQueriable').up()
                .ele('NameNormalized').up()
                .ele('NoWordBreaker').up()
                .ele('TokenNormalization', data[2][i].Token ? 1 : 0).up()
                .ele('Queryable', data[2][i].Queryable ? 1 : 0).up()
                .ele('RemoveDuplicates').up()
                .ele('RespectPriority', data[2][i].Order ? 1 : 0).up()
                .ele('Retrievable', data[2][i].Retrievable ? 1 : 0).up()
                .ele('Searchable', data[2][i].Searchable ? 1 : 0).up()
                .ele('Refinable', refinable).up()
                .ele('RefinerType', refinableType).up()
                .ele('HasMultipleValues', data[2][i].MultiValue ? 1 : 0).up()
                .ele('Sortable', sortable).up()
                .ele('SortableType', sortableType).up()
                .ele('CompleteMatching', data[2][i].Complete ? 1 : 0).up()
                .ele('AdvancedSearchableSettings').up()
                .ele('SafeForAnonymous', data[2][i].Safe ? 1 : 0).up()
                .ele('Tenant').up()
<<<<<<< HEAD
=======
                .ele('OnlyCrawledProperties').up();
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6

            var crawledPropertiesList = searchschema.ele('CrawledPropertiesList');

            if (data[2][i].Mapping) {
                data[2][i].Mapping.forEach(el => {
                    el.CrawledProperties.forEach(cp => {
                        if (el.Action === "Create") {
                            crawledPropertiesList.ele('AddedCrawlProperty')
                                .ele('Name', cp).up()
                                .ele('Category', el.Category).up()
                                .ele('SearchApplication', data[2][i].Ssa).up()
                                .ele('Tenant').up();
                        }
                        else if (el.Action === "Remove") {
                            crawledPropertiesList.ele('RemovedCrawlProperty')
                                .ele('Name', cp).up()
                                .ele('Category', el.Category).up()
                                .ele('SearchApplication', data[2][i].Ssa).up()
                                .ele('Tenant').up();
                        }
                        ;
                    });
                });
            };
        };

<<<<<<< HEAD
=======
        var resultSource = xml.node("ResultSource");

>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
        for( let i = 0; i < data[3].length; i++ ) {
            //Result Source
            let rsType;

            if(data[3][i].Type) {
                if(data[3][i].Type === "Local SharePoint") { rsType = "Local" }
                else if(data[3][i].Type === "Local People") { rsType = "LocalPeople" }
                else if(data[3][i].Type === "Remote SharePoint") { rsType = "Remote" }
                else if(data[3][i].Type === "Remote People") {  rsType = "RemotePeople" }
                else if(data[3][i].Type === "OpenSearch") { rsType = "Open" }
                else if(data[3][i].Type === "Exchange") { rsType = "Exchange" }
            }
<<<<<<< HEAD
            
            xml.node("ResultSource")
            .attribute({ Name: data[3][i].Name })
=======

            resultSource
            .ele("Name", data[3][i].Name).up()
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6
            .ele("SearchApplication", data[3][i].Ssa).up()
            .ele("Type", rsType).up()
            .ele("Description", data[3][i].Description).up()
            .ele("RemoteUrl", data[3][i].RemoteUrl).up()
            .ele("QueryTransform", data[3][i].QueryTransform).up()
        }
<<<<<<< HEAD
=======
        
       xml.node("RunCrawl", runCrawl);
>>>>>>> 0c2a2adb8bd934ddd6bac1e78c93cb3e55c7eda6

    return xml.end({ pretty: true });
};

module.exports = new XMLParser;

