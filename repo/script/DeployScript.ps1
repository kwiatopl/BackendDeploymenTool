function LogWrite()
{
    param
    (
        $logMessage,
        $logFile
    )
	$message = Get-Date -Format "yyyy-MM-dd HH:mm:ss -> "
	$message = $message + $logMessage
    Add-content $logFile -value $message -ErrorAction Stop
}

function ArchiveFiles($date) {
    try 
    {
        LogWrite -logMessage ("Moving actual XML and log file to Archive folder") -logFile $logFile
        [string]$logDir = "$PsScriptRoot\"+ $date +"_DeployScriptLog.log"
        [string]$xmlDir = "$PsScriptRoot\DeployScriptData.xml"
        [string]$archiveDir = "$PsScriptRoot\Archive\"
        [string]$xmlDestination = $archiveDir + $date + "_DeployScriptData.xml"
        New-Item $archiveDir -type Directory -ErrorAction SilentlyContinue
        LogWrite -logMessage ("Created Archive directory {0}" -f $archiveDir) -logFile $logFile
        LogWrite -logMessage ("Moving files") -logFile $logFile
        Move-Item -Path $xmlDir -Destination $xmlDestination
        Move-Item -Path $logDir -Destination $archiveDir
    }
    catch
    {
        LogWrite -logMessage ("### ERROR ### XML File failed to be moved to archive folder with error message {0}" -f $_.Exception.Message) -logFile $logFile
        break
    }
}

function MailLog($log)
{
    Add-PSSnapin Microsoft.Exchange.Management.Powershell.Admin -erroraction silentlyContinue
    $smtpServer = "mailgot.it.volvo.com"
    $att = New-object Net.Mail.Attachment($log)
    $msg = New-Object Net.Mail.MailMessage
    $smtp = new-object Net.Mail.SmtpClient($smtpServer)
    $msg.From = "noreply@volvo.com"
    $msg.To.Add("support.search@volvo.com")
    $actualDate = Get-Date -format g
    $msg.Subject = $actualDate + " Deploy Script Log" 
    $msg.Body = "This mail is generated automatically. Please don't respond to this message.

    This mail contains Deploy Script log file from " + $actualDate + " as attachment"
    $msg.Attachments.Add($att)
    $smtp.Send($msg)
    $att.Dispose()
}

function CheckContentSources($nodes)
{
    foreach($node in $nodes) #FOR EACH CONTENT SOURCE IN XML FILE
    {
        $app = ''
        try 
        {
            $app = Get-SPServiceApplication -Name $node.SearchApplication -ErrorAction SilentlyContinue   #GET SERVICE APP FOR CONTENT SOURCE STATED IN XML TO BE ADDED/EDITED 
        }
        catch 
        {
            LogWrite -logMessage ("### ERROR ### Failed to load SP Service Application with exception message: '{0}'" -f $_.Exception.Message) -logFile $logFile
        }
        
        if(-Not $app)
        {
            LogWrite -logMessage ("### WARN ### Failed to load SP Service Application '{0}'" -f $node.SearchApplication) -logFile $logFile
        }
        else
        {    
            LogWrite -logMessage ("Loaded SP Service Application '{0}'" -f $node.SearchApplication) -logFile $logFile
            $actualContentSources = ''
            try 
            {
                $actualContentSources = Get-SPEnterpriseSearchCrawlContentSource -SearchApplication $app -ErrorAction SilentlyContinue    #GETTING ACTUAL CONTENT SOURCE, SAME AS THAT IN XML
            }
            catch 
            {
                LogWrite -logMessage ("### ERROR ### Failed to load Content Sources from SSA with exception message: '{0}'" -f $_.Exception.Message) -logFile $logFile
            }
            if(-Not $actualContentSources)
            {
                LogWrite -logMessage ("### WARN ### Failed to load Content Sources from SP Service Application: '{0}'" -f $node.SearchApplication) -logFile $logFile
            }
            else 
            {
                LogWrite -logMessage ("Loaded Content Sources from SP Service Application: '{0}'" -f $node.SearchApplication) -logFile $logFile
                $csToEdit = $null   #EDIT FLAG
                LogWrite -logMessage ("Checking if Content Sources already exists") -logFile $logFile
                foreach($cs in $actualContentSources)   #FOR EACH CONTENT SOURCE IN SERVICE APPLICATION
                {
                    if($cs.Name -eq $node.Name)     #IF CONTENT SOURCE IN SA MATCH WITH THAT IN XML
                    {
                        $csToEdit = $cs     #PASS CONTENT SOURCE TO VARIABLE
                        LogWrite -logMessage ("Content Source from XML: '{0}' is the same as Content Source from SP App: '{1}'" -f $node.Name, $cs.Name) -logFile $logFile
                        LogWrite -logMessage ("Passing Content Source '{0}' to EditContentSource function" -f $cs.Name) -logFile $logFile
                        EditContentSource $csToEdit $node   
                        LogWrite -logMessage ("Content Source '{0}' returned from EditContentSource function" -f $cs.Name) -logFile $logFile
                    }
                }
                if($csToEdit -eq $null)  #IF NO CONTENT SOURCE IN XML RESEMBLES THOSE IN SERVICE APPLICATION
                {
                    LogWrite -logMessage ("Content Source from XML: '{0}' doesn't exist in SP App: '{1}'" -f $node.Name, $app) -logFile $logFile
                    LogWrite -logMessage ("Passing Content Source '{0}' to AddContentSource function" -f $node.Name) -logFile $logFile
                    AddContentSource $node
                    LogWrite -logMessage ("Content Source '{0}' returned from AddContentSource function" -f $node.Name) -logFile $logFile
                }
            }
        }
    }
}

function AddContentSource($node)
{
    LogWrite -logMessage ("Content Source '{0}' received in AddContentSource function" -f $node.Name) -logFile $logFile
    $name = $node.Name
    $maxPage = ZeroCheck $node.MaxPageEnumerationDepth
    $maxSite = ZeroCheck $node.MaxSiteEnumerationDepth
    $proxyGroup = $node.BDCApplicationProxyGroup
	$crawlBehavior = $node.SelectSingleNode("//CrawlSettings").SharepointCrawlBehavior
	if($crawlBehavior -eq '') 
	{
		$crawlBehavior = $null
	}

    if($node.Type -eq 'Business')   # FOR BUSINESS TYPE CONTENT SOURCE
    {
        LogWrite -logMessage ("{0}: Selected 'Business' type" -f $node.Name) -logFile $logFile
        ListAllLOBSystems($node)
        if($proxyGroup -eq '')
        {
            LogWrite -logMessage ("{0}: Setting default Application Proxy Group" -f $node.Name) -logFile $logFile
            try 
            {
                $proxyGroup = Get-SPServiceApplicationProxyGroup -default                   
            }
            catch 
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to load default proxy group with exception message: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
            }
        }
        foreach($LOBnode in $node.SelectNodes("//ContentSource[@Name='$name']/LOBSystemSetList/LOBSystemSet"))  # FOREACH LOB SYSTEM PAIR IN XML
        {
            if($LOBnode.LOBSystemName -ne '' -and $LOBnode.LOBSystemInstanceName -ne '')
            {
                # GETTING LOB SYSTEM FROM XML
                LogWrite -logMessage ("{0}: Loading LOB System Name and LOB System Instance Name from XML" -f $node.Name) -logFile $logFile
                $sysName = $LOBnode.LOBSystemName
                $sysInstance = $LOBnode.LOBSystemInstanceName
                $lobSystems += @($sysName,$sysInstance) 
                LogWrite -logMessage ("{0}: Loaded LOB System pair - {1}, {2};" -f $node.Name, $sysName, $sysInstance) -logFile $logFile
            }
        }
    }
    
    # CREATING NEW CONTENT SOURCE
    LogWrite -logMessage ("{0}: Creating new Content Source" -f $node.Name) -logFile $logFile
    try
    {
        $newContentSource = New-SPEnterpriseSearchCrawlContentSource -Name $node.Name -SearchApplication $app -Type $node.Type -StartAddresses $node.StartAddresses -SharePointCrawlBehavior $crawlBehavior -MaxPageEnumerationDepth $maxPage -MaxSiteEnumerationDepth $maxSite -BDCApplicationProxyGroup $proxyGroup -LOBSystemSet $lobSystems -CrawlPriority $node.SelectSingleNode('//CrawlSettings').CrawlPriority
    }
    catch
    {
        LogWrite -logMessage ("### ERROR ### {0}: Failed to create Content Source with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
    }
    if(-Not $newContentSource)
    {
        LogWrite -logMessage ("### WARN ### {0}: Failed to create Content Source" -f $node.Name) -logFile $logFile
    }
    else
    {
        $newContentSource.Update()
        LogWrite -logMessage ("{0}: Content Source created with parameters: Name: {0}; SSA: {1}; Type: {2}; Start Address: {3}" -f $node.Name, $node.SearchApplication, $node.Type, $node.StartAddresses) -logFile $logFile
        # GETTING NEWLY CREATED CONTENT SOURCE
        try 
        {
            $acs = Get-SPEnterpriseSearchCrawlContentSource -SearchApplication $app -Identity $node.Name -ErrorAction SilentlyContinue
        }
        catch 
        {
            LogWrite -logMessage ("### ERROR ### {0}: Failed to get Content Source for Continuous Crawl check with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
        }
        # CHECK FOR CONTINUOUS CRAWL
        LogWrite -logMessage ("{0}: Checking for Continuous Crawl" -f $node.Name) -logFile $logFile
        if($node.SelectSingleNode('//CrawlSettings').ContinuousCrawl -eq 1) 
        {
            LogWrite -logMessage ("{0}: Enabling Continuous Crawl" -f $node.Name) -logFile $logFile
            try
            {
                Set-SPEnterpriseSearchCrawlContentSource -Identity $acs -EnableContinuousCrawls $True
            }
            catch
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to set Continuous Crawl for Content Source with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
            }
        }

        # CHECK FOR CRAWL SCHEDULES
        LogWrite -logMessage ("{0}: Checking for Crawl Schedules" -f $node.Name) -logFile $logFile
        if($node.SelectNodes("//ContentSource[@Name='$name']/CrawlScheduleList/CrawlSchedule").ScheduleType -ne '' -and $node.SelectNodes("//ContentSource[@Name='$name']/CrawlScheduleList/CrawlSchedule").ScheduleType -ne $null) 
        {
            # STEPPING INTO CRAWL SCHEDULE FUNCTION 
            LogWrite -logMessage ("{0}: Crawl Schedules found" -f $node.Name) -logFile $logFile
            LogWrite -logMessage ("{0}: Stepping into CrawlSchedule function" -f $node.Name) -logFile $logFile
            CrawlSchedule $node $acs
        }
        else
        {
            LogWrite -logMessage ("{0}: No Crawl Schedules found" -f $node.Name) -logFile $logFile
        }
        LogWrite -logMessage ("{0}: Stepping out of CrawlSchedule function" -f $node.Name) -logFile $logFile
    }
}

function CrawlSchedule($node, $acs)
{ 
    LogWrite -logMessage ("{0}: Crawl Schedules for Content Source '{0}' received" -f $node.Name) -logFile $logFile
    $name = $node.Name
    $numerator = 0 # NUMERATOR TO RESTRICT READING ONLY TWO FIRST CRAWL SCHEDULES
    foreach($singlenode in $node.SelectNodes("//ContentSource[@Name='$name']/CrawlScheduleList/CrawlSchedule"))      #FOR EACH CRAWL SCHEDULE IN XML FILE
    {
        $numerator++  # RESTRICT TO ONLY 2 CRAWL SCHEDULES PER CONTENT SOURCE
        if($singlenode.ScheduleType -ne '' -and $numerator -le 2)
        {
            switch($singlenode.CrawlScheduleType)
            {
                Daily
                {
                    LogWrite -logMessage ("{0}: Stepping into Daily Crawl Schedule" -f $name) -logFile $logFile
                    LogWrite -logMessage ("{0}: Adding Daily Crawl Schedule" -f $name) -logFile $logFile
                    try 
                    {
                        Set-SPEnterpriseSearchCrawlContentSource -Identity $acs -ScheduleType ($singlenode.ScheduleType -as [string]) -DailyCrawlSchedule -CrawlScheduleRunEveryInterval ($singlenode.CrawlScheduleRunEveryInterval -as [int]) -CrawlScheduleStartDateTime ($singlenode.CrawlScheduleStartDateTime -as [datetime]) -CrawlScheduleRepeatInterval ($singlenode.CrawlScheduleRepeatInterval -as [int]) -CrawlScheduleRepeatDuration ($singlenode.CrawlScheduleRepeatDuration) -ErrorAction SilentlyContinue   
                    }
                    catch 
                    {
                        LogWrite -logMessage ("### ERROR ### {0}: Failed to set Crawl Schedule for Content Source with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
                    }
                    LogWrite -logMessage ("{0}: Added Daily Crawl Schedule for Content Source '{0}' with parameters: Schedule Type: {1}; Run Every: {2}; Start date time: {3}; Repeat Interval: {4}; Repeat Duration: {5};" -f $name, $singlenode.ScheduleType, $singlenode.CrawlScheduleRunEveryInterval, $singlenode.CrawlScheduleStartDateTime, $singlenode.CrawlScheduleRepeatInterval, $singlenode.CrawlScheduleRepeatDuration)-logFile $logFile
                    break
                }
                Weekly
                {
                    LogWrite -logMessage ("{0}: Stepping into Weekly Crawl Schedule" -f $name) -logFile $logFile
                    LogWrite -logMessage ("{0}: Adding Weekly Crawl Schedule" -f $name) -logFile $logFile
                    try 
                    {
                        Set-SPEnterpriseSearchCrawlContentSource -Identity $acs -ScheduleType ($singlenode.ScheduleType -as [string]) -WeeklyCrawlSchedule -CrawlScheduleRunEveryInterval ($singlenode.CrawlScheduleRunEveryInterval -as [int]) -CrawlScheduleDaysOfWeek ($singlenode.CrawlScheduleDaysOfWeek -as [string]) -CrawlScheduleStartDateTime ($singlenode.CrawlScheduleStartDateTime -as [datetime]) -CrawlScheduleRepeatInterval ($singlenode.CrawlScheduleRepeatInterval -as [int]) -CrawlScheduleRepeatDuration ($singlenode.CrawlScheduleRepeatDuration) -ErrorAction SilentlyContinue
                    }
                    catch 
                    {
                        LogWrite -logMessage ("### ERROR ### {0}: Failed to set Crawl Schedule for Content Source with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
                    }
                    LogWrite -logMessage ("{0}: Added Weekly Crawl Schedule for Content Source {0} with parameters: Schedule Type: {1};  Days of Week: {2}; Run Every:{3}; Start date time: {4}; Repeat Interval: {5}; Repeat Duration: {6};" -f $name, $singlenode.ScheduleType, $singlenode.CrawlScheduleDaysOfWeek, $singlenode.CrawlScheduleRunEveryInterval ,$singlenode.CrawlScheduleStartDateTime, $singlenode.CrawlScheduleRepeatInterval, $singlenode.CrawlScheduleRepeatDuration)-logFile $logFile
                    break
                }
                Monthly
                {
                    LogWrite -logMessage ("{0}: Stepping into Monthly Crawl Schedule" -f $name) -logFile $logFile
                    LogWrite -logMessage ("{0}: Adding Monthly Crawl Schedule" -f $name) -logFile $logFile 
                    try 
                    {
                        Set-SPEnterpriseSearchCrawlContentSource -Identity $acs -ScheduleType ($singlenode.ScheduleType -as [string]) -MonthlyCrawlSchedule -CrawlScheduleDaysOfMonth ($singlenode.CrawlScheduleDaysOfMonth -as [int]) -CrawlScheduleMonthsOfYear ($singlenode.CrawlScheduleMonthsOfYear -as [string]) -CrawlScheduleStartDateTime ($singlenode.CrawlScheduleStartDateTime -as [datetime]) -CrawlScheduleRepeatInterval ($singlenode.CrawlScheduleRepeatInterval -as [int]) -CrawlScheduleRepeatDuration ($singlenode.CrawlScheduleRepeatDuration) -ErrorAction SilentlyContinue
                    }
                    catch 
                    {
                        LogWrite -logMessage ("### ERROR ### {0}: Failed to set Crawl Schedule for Content Source with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
                    }
                    LogWrite -logMessage ("{0}: Added Monthly Crawl Schedule for Content Source {0} with parameters: Schedule Type: {1}; Days of Month: {2}; Months of Year: {3}; Start date time: {4}; Repeat Interval: {5}; Repeat Duration: {6};" -f $name, $singlenode.ScheduleType, $singlenode.CrawlScheduleDaysOfMonth, $singlenode.CrawlScheduleMonthsOfYear, $singlenode.CrawlScheduleStartDateTime, $singlenode.CrawlScheduleRepeatInterval, $singlenode.CrawlScheduleRepeatDuration)-logFile $logFile
                    break
                }
                Default
                { 
                    LogWrite -logMessage ("{0}: Not found Crawl Schedule named '{1}'" -f $name, $singlenode.ScheduleType) -logFile $logFile
                    break
                }
            }
        }
        elseif($singlenode.ScheduleType -eq '')
        {
            try 
            {
                $contentSource = Get-SPEnterpriseSearchCrawlContentSource -SearchApplication $node.SearchApplication -Identity $acs
            }
            catch 
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to get actual Crawl Schedule from Content Source with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
            }
            if($singlenode.ScheduleType -eq 'Full')
            {
                $contentSource.FullCrawlSchedule = $null
            }
            elseif($singlenode.ScheduleType -eq 'Incremental')
            {
                $contentSource.IncrementalCrawlSchedule = $null
            }
            else
            {
                $contentSource.FullCrawlSchedule = $null
                $contentSource.IncrementalCrawlSchedule = $null
            }
            $contentSource.Update()
        }
        else
        {
            # MORE THAN TWO SCHEDULES PASSED
            LogWrite -logMessage ("{0}: Tried to add more than two crawl schedules. Last schedules has been ignored" -f $name) -logFile $logFile
        }
    }
}

function EditContentSource($csToEdit, $nodeToEdit)
{
    LogWrite -logMessage ("{0}: Content Source '{0}' received in EditContentSource function"-f $csToEdit.Name) -logFile $logFile
    # GETTING ACTUAL CRAWL SCHEDULE FOR SPECIFIC CONTENT SOURCE
    LogWrite -logMessage ("{0}: Loading actual Crawl Schedules" -f $csToEdit.Name) -logFile $logFile
    try 
    {
        $actualCrawlSchedule =  Get-SPEnterpriseSearchCrawlContentSource -Identity $csToEdit.Name -SearchApplication $app -ErrorAction SilentlyContinue
    }
    catch 
    {
        LogWrite -logMessage ("### ERROR ### {0}: Failed to get Crawl Schedules from Content Source to edit with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
    }
    if(-Not $actualCrawlSchedule)
    {
        LogWrite -logMessage ("### WARN ### {0}: Failed to load actual Crawl Schedules" -f $csToEdit.Name) -logFile $logFile
    }
    else 
    {
        # LISTING ACTUAL INCREMENTAL AND FULL CRAWL SCHEDULES
        if($fullcrawlschedule -eq '')
        {
            LogWrite -logMessage ("{0}: No Full Crawl Schedule" -f $csToEdit.Name) -logFile $logFile
        }
        else 
        {
            LogWrite -logMessage ("{0}: Listing actual Full Crawl Schedule: {1}" -f $csToEdit.Name, $fullcrawlschedule) -logFile $logFile
        }
        if($incrementalcrawlschedule -eq '')
        {
            LogWrite -logMessage ("{0}: No Incremental Crawl Schedule" -f $csToEdit.Name) -logFile $logFile
        }
        else 
        {
            LogWrite -logMessage ("{0}: Listing actual Incremental Crawl Schedule: {1}" -f $csToEdit.Name, $incrementalcrawlschedule) -logFile $logFile
        }
        # STEPPING INTO CRAWL SCHEDULE FUNCTION 
        LogWrite -logMessage ("{0}: Stepping into CrawlSchedule function" -f $csToEdit.Name) -logFile $logFile
        CrawlSchedule $nodeToEdit $actualCrawlSchedule
        LogWrite -logMessage ("{0}: Stepping out of CrawlSchedule function" -f $csToEdit.Name) -logFile $logFile
    }
}


function ManageCrawlRules($nodes)
{
    LogWrite -logMessage ("Stepped into ManageCrawlRules function") -logFile $logFile
    foreach($crawlrule in $nodes) # FOREACH CRAWL RULE IN XML
    {    
        [Nullable[int]]$priority = $crawlrule.Priority - 1 # PARAMETERS
        $securePass = $null # PARAMETERS
        # MAKING SECURE STRING FOR ACCOUNT PASSWORD
        if($crawlrule.AccountPassword -ne '')
        {
            LogWrite -logMessage ("Creating Secure String for Account Password") -logFile $logFile
            try 
            {
                $securePass = ConvertTo-SecureString -String $crawlrule.AccountPassword -AsPlainText -Force -ErrorAction SilentlyContinue
            }
            catch 
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to create secure string for password with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
            }
            
            if($securePass)
            {
                LogWrite -logMessage ("Created Secure String for Account Password") -logFile $logFile
            }
        }
        if($crawlrule.Priority -eq '')
        {
            $priority = $null
        }
        if($crawlrule.Path -ne '')
        {
            LogWrite -logMessage ("{0}: Loaded Crawl Rule" -f $crawlrule.Path) -logFile $logFile
            try 
            {
                $app = Get-SPEnterpriseSearchServiceApplication -Identity $crawlrule.SearchApplication -ErrorAction SilentlyContinue  # SEARCH APP
            }
            catch 
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to get Search Service Application with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
            }
            if(-Not $app)
            {
                LogWrite -logMessage ("### WARN ### {0}: Failed to load Search Application {1}" -f $crawlrule.Path, $crawlrule.SearchApplication) -logFile $logFile
            }
            else 
            {
                LogWrite -logMessage ("{0}: Loaded Search Application {1}" -f $crawlrule.Path, $crawlrule.SearchApplication) -logFile $logFile
            }
           
            try 
            {
                $acr = Get-SPEnterpriseSearchCrawlRule -SearchApplication $app -ErrorAction SilentlyContinue # ACTUAL CRAWL RULES
            }
            catch 
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to get Crawl Rules for SSA with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
            }
            
            if(-Not $acr)
            {
                LogWrite -logMessage ("### WARN ### {0}: Failed to load Crawl Rules for Search Application {1}" -f $crawlrule.Path, $crawlrule.SearchApplication) -logFile $logFile
            }
            else 
            {
                LogWrite -logMessage ("{0}: Loaded Crawl Rules for Search Application {1}" -f $crawlrule.Path, $crawlrule.SearchApplication) -logFile $logFile
            }
            if($acr -ne $null -and $app -ne $null)
            {
                foreach($rule in $acr)  # FOREACH ACTUAL RULE IN SEARCH APPLICATION
                {
                    if($rule.Path -eq $crawlrule.Path)
                    {
                        LogWrite -logMessage ("{0}: Crawl Rule already exists" -f $crawlrule.Path) -logFile $logFile
                        LogWrite -logMessage ("{0}: Deleting Crawl Rule " -f $crawlrule.Path) -logFile $logFile
                        try 
                        {
                            Remove-SPEnterpriseSearchCrawlRule -Identity $rule.Path -SearchApplication $app -Confirm:$false -ErrorAction SilentlyContinue # REMOVE DUPLICATED CRAWL RULE
                        }
                        catch 
                        {
                            LogWrite -logMessage ("### ERROR ### {0}: Failed to delete Crawl Rule with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
                        }
                        LogWrite -logMessage ("{0}: Deleted Crawl Rule" -f $crawlrule.Path) -logFile $logFile    
                    }
                }        
                try 
                {
                    switch($crawlrule.Type)
                    {
                        ExclusionRule
                        {
                            LogWrite -logMessage ("{0}: Exclusion Type Crawl Rule" -f $crawlrule.Path) -logFile $logFile
                            LogWrite -logMessage ("{0}: Adding Crawl Rule" -f $crawlrule.Path) -logFile $logFile
                            $ruleToAdd = New-SPEnterpriseSearchCrawlRule -Path $crawlrule.Path -SearchApplication $app -Type $crawlrule.Type -IsAdvancedRegularExpression ([int]$crawlrule.IsAdvancedRegularExpression -as [bool]) -FollowComplexUrls ([int]$crawlrule.FollowComplexURLs -as [bool]) -Priority $priority -ErrorAction SilentlyContinue   
                            break
                        }
                        InclusionRule
                        {
                            LogWrite -logMessage ("{0}: Inclusion Type Crawl Rule" -f $crawlrule.Path) -logFile $logFile
                            switch($crawlrule.AuthenticationType)
                            {
                                DefaultRuleAccess
                                {  
                                    LogWrite -logMessage ("{0}: Adding Crawl Rule with Authentication Type {1}" -f $crawlrule.Path, $crawlrule.AuthenticationType) -logFile $logFile
                                    $ruleToAdd = New-SPEnterpriseSearchCrawlRule -Path $crawlrule.Path -SearchApplication $app -AuthenticationType $crawlrule.AuthenticationType -Type $crawlrule.Type -CrawlAsHttp ([int]$crawlrule.CrawlAsHTTP -as [bool]) -FollowComplexUrls ([int]$crawlrule.FollowComplexURLs -as [bool]) -IsAdvancedRegularExpression ([int]$crawlrule.IsAdvancedRegularExpression -as [bool]) -Priority $priority -SuppressIndexing ([int]$crawlrule.SuppressIndexing -as [bool]) -ErrorAction SilentlyContinue
                                }
                                BasicAccountRuleAccess
                                {
                                    LogWrite -logMessage ("{0}: Adding Crawl Rule with Authentication Type {1}" -f $crawlrule.Path, $crawlrule.AuthenticationType) -logFile $logFile
                                    $ruleToAdd = New-SPEnterpriseSearchCrawlRule -Path $crawlrule.Path -SearchApplication $app -AuthenticationType $crawlrule.AuthenticationType -Type $crawlrule.Type -CrawlAsHttp ([int]$crawlrule.CrawlAsHTTP -as [bool]) -FollowComplexUrls ([int]$crawlrule.FollowComplexURLs -as [bool]) -IsAdvancedRegularExpression ([int]$crawlrule.IsAdvancedRegularExpression -as [bool]) -AccountName $crawlrule.AccountName -AccountPassword $securePass -Priority $priority -SuppressIndexing ([int]$crawlrule.SuppressIndexing -as [bool]) -ErrorAction SilentlyContinue
                                }
                                NTLMAccountRuleAccess   # NEED CORRECT ACCOUNT NAME AND ACCOUNT PASSWORD 
                                {
                                    # ! FEW FAILED LOGINS MAY RESULT IN ACCOUNT LOCKOUT !
                                    LogWrite -logMessage ("{0}: Adding Crawl Rule with Authentication Type {1}" -f $crawlrule.Path, $crawlrule.AuthenticationType) -logFile $logFile
                                    $ruleToAdd = New-SPEnterpriseSearchCrawlRule -Path $crawlrule.Path -SearchApplication $app -AuthenticationType $crawlrule.AuthenticationType -Type $crawlrule.Type -CrawlAsHttp ([int]$crawlrule.CrawlAsHTTP -as [bool]) -FollowComplexUrls ([int]$crawlrule.FollowComplexURLs -as [bool]) -IsAdvancedRegularExpression ([int]$crawlrule.IsAdvancedRegularExpression -as [bool]) -AccountName $crawlrule.AccountName -AccountPassword $securePass -Priority $priority -ErrorAction SilentlyContinue -SuppressIndexing ([int]$crawlrule.SuppressIndexing -as [bool])
                                    if(-Not $ruleToAdd) 
                                    {
                                        LogWrite -logMessage ("{0}: Incorrect Account Name or Account Password" -f $crawlrule.Path) -logFile $logFile
                                    }
                                }
                                CertificateRuleAccess
                                {
                                    LogWrite -logMessage ("{0}: Adding Crawl Rule with Authentication Type {1}" -f $crawlrule.Path, $crawlrule.AuthenticationType) -logFile $logFile
                                    $ruleToAdd = New-SPEnterpriseSearchCrawlRule -Path $crawlrule.Path -SearchApplication $app -AuthenticationType $crawlrule.AuthenticationType -Type $crawlrule.Type -CrawlAsHttp ([int]$crawlrule.CrawlAsHTTP -as [bool]) -FollowComplexUrls ([int]$crawlrule.FollowComplexURLs -as [bool]) -IsAdvancedRegularExpression ([int]$crawlrule.IsAdvancedRegularExpression -as [bool]) -AccountName $crawlrule.AccountName -Priority $priority -SuppressIndexing ([int]$crawlrule.SuppressIndexing -as [bool]) -ErrorAction SilentlyContinue
                                }
                                FormRuleAccess
                                {
                                    LogWrite -logMessage ("{0}: Adding Crawl Rule with Authentication Type {1}" -f $crawlrule.Path, $crawlrule.AuthenticationType) -logFile $logFile
                                    $ruleToAdd = New-SPEnterpriseSearchCrawlRule -Path $crawlrule.Path -SearchApplication $app -AuthenticationType $crawlrule.AuthenticationType -Type $crawlrule.Type -CrawlAsHttp ([int]$crawlrule.CrawlAsHTTP -as [bool]) -FollowComplexUrls ([int]$crawlrule.FollowComplexURLs -as [bool]) -IsAdvancedRegularExpression ([int]$crawlrule.IsAdvancedRegularExpression -as [bool]) -Priority $priority -AccountName $crawlrule.AccountName -SuppressIndexing ([int]$crawlrule.SuppressIndexing -as [bool]) -ErrorAction SilentlyContinue
                                }
                                CookieRuleAccess
                                {
                                    LogWrite -logMessage ("{0}: Adding Crawl Rule with Authentication Type {1}" -f $crawlrule.Path, $crawlrule.AuthenticationType) -logFile $logFile
                                    $ruleToAdd = New-SPEnterpriseSearchCrawlRule -Path $crawlrule.Path -SearchApplication $app -AuthenticationType $crawlrule.AuthenticationType -Type $crawlrule.Type -CrawlAsHttp ([int]$crawlrule.CrawlAsHTTP -as [bool]) -FollowComplexUrls ([int]$crawlrule.FollowComplexURLs -as [bool]) -IsAdvancedRegularExpression ([int]$crawlrule.IsAdvancedRegularExpression -as [bool]) -Priority $priority -AccountName $crawlrule.AccountName -SuppressIndexing ([int]$crawlrule.SuppressIndexing -as [bool]) -ErrorAction SilentlyContinue
                                }
                                AnonymousAccess
                                {
                                    LogWrite -logMessage ("{0}: Adding Crawl Rule with Authentication Type {1}" -f $crawlrule.Path, $crawlrule.AuthenticationType) -logFile $logFile
                                    $ruleToAdd = New-SPEnterpriseSearchCrawlRule -Path $crawlrule.Path -SearchApplication $app -AuthenticationType $crawlrule.AuthenticationType -Type $crawlrule.Type -CrawlAsHttp ([int]$crawlrule.CrawlAsHTTP -as [bool]) -FollowComplexUrls ([int]$crawlrule.FollowComplexURLs -as [bool]) -IsAdvancedRegularExpression ([int]$crawlrule.IsAdvancedRegularExpression -as [bool]) -Priority $priority -SuppressIndexing ([int]$crawlrule.SuppressIndexing -as [bool]) -ErrorAction SilentlyContinue
                                } 
                                Default
                                {
                                    LogWrite -logMessage ("{0}: Not found Crawl Rule Authentication Type {1}" -f $crawlrule.Path, $crawlrule.AuthenticationType) -logFile $logFile
                                    break
                                }
                            }
                            break
                        }
                        Default
                        {
                            LogWrite -logMessage ("{0}: Not found Crawl Rule Type {1}" -f $crawlrule.Path, $crawlrule.Type) -logFile $logFile
                            break
                        }
                    }
                }
                catch
                {
                    LogWrite -logMessage ("### ERROR ### {0}: Failed to stage adding of new Crawl Rule with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
                }
            }
            if($ruleToAdd -ne $null)    # IF RULE IS CORRECTLY ASSIGNED
            {
                try 
                {
                    $ruleToAdd.Update() # ADD CRAWL RULE
                }
                catch 
                {
                    LogWrite -logMessage ("### ERROR ### {0}: Failed to commit adding of Crawl Rule with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
                }
                LogWrite -logMessage ("{0}: Added Crawl Rule with parameters: Path: {0}; SSA: {1}; Type: {2}; CrawlAsHttp: {3}; FollowComplexUrls: {4}; Regex: {5}; SuppressIndexing: {6}; Priority: {7};" -f $crawlrule.Path, $crawlrule.SearchApplication, $crawlrule.Type, $crawlrule.CrawlAsHTTP, $crawlrule.FollowComplexURLs, $crawlrule.IsAdvancedRegularExpression, $crawlrule.SuppressIndexing, $crawlrule.Priority) -logFile $logFile
            }
        }
    }
}

function SearchSchema($nodeSchema)
{
    LogWrite -logMessage ("Stepped into SearchSchema function") -logFile $logFile
    foreach($node in $nodeSchema.SelectNodes('//ManagedProperty'))  # FOREACH MANAGED PROPERTY IN XML
    {
        $managedProperty = $null
        $name = $node.Name  # NEEDED FOR SELECTING SPECIFIC NODES FROM XML-OBJECT
        LogWrite -logMessage ("{0}: Loading Managed Property" -f $node.Name) -logFile $logFile
        try 
        {
            $managedProperty = Get-SPEnterpriseSearchMetadataManagedProperty -SearchApplication $node.SearchApplication -Identity $node.Name -ErrorAction SilentlyContinue  # GET MANAGED PROPERTY WITH SAME NAME AS THAT IN XMLs   
            LogWrite -logMessage ("{0}: Loaded Managed Property" -f $node.Name) -logFile $logFile
        }
        catch 
        {
            LogWrite -logMessage ("### ERROR ### {0}: Failed to get Managed Properties with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
        }
        if($managedProperty -eq $null)  # IF NOT FOUND THE MANAGED PROPERTY
        {
            LogWrite -logMessage ("{0}: Not found Managed Property in Search Application {1}" -f $node.Name, $node.SearchApplication) -logFile $logFile
            LogWrite -logMessage ("{0}: Creating Managed Property" -f $node.Name) -logFile $logFile
            try
            {
                $managedProperty = New-SPEnterpriseSearchMetadataManagedProperty -Name $node.Name -SearchApplication $node.SearchApplication -Type $node.Type -ErrorAction Continue   
            }
            catch 
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to stage creation of new Managed Property with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
            }
            if(-Not $managedProperty)
            {
                LogWrite -logMessage ("### WARN ### {0}: Failed to create Managed Property" -f $node.Name) -logFile $logFile    
            }
            else 
            {
                try 
                {
                    $managedProperty.Update()
                    $managedProperty.RemoveDuplicates = [int]$node.RemoveDuplicates -as [bool]
                    $managedProperty.NoWordBreaker = [int]$node.NoWordBreaker -as [bool]
                    $managedProperty.FullTextQueriable = [int]$node.FullTextQueriable -as [bool]
                    $managedProperty.EnabledForScoping = [int]$node.EnabledForScoping -as [bool]
                    $managedProperty.SafeForAnonymous = [int]$node.SafeForAnonymous -as [bool]
                    $managedProperty.NameNormalized = [int]$node.NameNormalized -as [bool]
                    $managedProperty.RespectPriority = [int]$node.RespectPriority -as [bool]
                    $managedProperty.Retrievable = [int]$node.Retrievable -as [bool]
                    $managedProperty.Queryable = [int]$node.Queryable -as [bool]
                    $managedProperty.Searchable = [int]$node.Searchable -as [bool]
                    $managedProperty.Sortable = [int]$node.Sortable -as [bool]
                    $managedProperty.Refinable = [int]$node.Refinable -as [bool]
                    $managedProperty.HasMultipleValues = [int]$node.HasMultipleValues -as [bool]
                    $managedProperty.TokenNormalization = [int]$node.TokenNormalization -as [bool]
                    if($node.SortableType -ne ''-and $managedProperty.Sortable -eq $true)
                    {
                        $managedProperty.SortableType = $node.SortableType
                    }
                    if($node.RefinerType -ne '' -and $managedProperty.Refinable -eq $true)
                    {
                        $managedProperty.RefinerConfiguration.Type = $node.RefinerType
                    }
                }
                catch
                {
                    LogWrite -logMessage ("### ERROR ### {0}: Failed to stage the updating of newly created Managed Property with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
                }
                # ADDING MANAGED PROPERTY WITH PARAMETERS ABOVE
                try 
                {
                    $managedProperty.Update()
                }
                catch 
                {
                    LogWrite -logMessage ("### ERROR ### {0}: Failed to commit the creation of new Managed Property with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
                }
                LogWrite -logMessage ("{0}: Created Managed Property" -f $node.Name) -logFile $logFile
                LogWrite -logMessage ("{0}: {1}" -f $node.Name, $managedProperty) -logFile $logFile
            }
        }
        elseif([int]$node.OnlyCrawledProperties -as [bool] -eq $true)
        {
            LogWrite -logMessage ("{0}: Managed Property passed to only add Crawled Properties" -f $node.Name) -logFile $logFile
			LogWrite -logMessage ("{0}: Found Managed Property" -f $node.Name) -logFile $logFile
			LogWrite -logMessage ("{0}: No changes made" -f $node.Name) -logFile $logFile
		}
        elseif([int]$node.OnlyCrawledProperties -as [bool] -eq $false)
        {
            LogWrite -logMessage ("{0}: Editing Managed Property" -f $node.Name) -logFile $logFile
            LogWrite -logMessage ("{0}: Found Managed Property in Search Application '{1}'" -f $node.Name, $node.SearchApplication) -logFile $logFile
            # CHANGES
            if($name -ne $managedProperty.Name -as [bool] -or $managedProperty.Retrievable -ne [int]$node.Retrievable -as [bool] -or $managedProperty.Queryable -ne [int]$node.Queryable -as [bool] -or $managedProperty.SafeForAnonymous -ne [int]$node.SafeForAnonymous -as [bool] -or $managedProperty.RespectPriority -ne [int]$node.RespectPriority -as [bool] -or $managedProperty.NameNormalized -ne [int]$node.NameNormalized -as [bool] -or $managedProperty.Sortable -ne [int]$node.Sortable -as [bool] -or $managedProperty.Refinable -ne [int]$node.Refinable -as [bool] -or $managedProperty.Searchable -ne [int]$node.Searchable -as [bool] -or $managedProperty.HasMultipleValues -ne [int]$node.HasMultipleValues -as [bool] -or $managedProperty.Sortable -ne [int]$node.Sortable -as [bool] -or $managedProperty.Refinable -ne [int]$node.Refinable -as [bool] -or $managedProperty.HasMultipleValues -ne [int]$node.HasMultipleValues -as [bool] -or [string]$managedProperty.SortableType -ne $node.SortableType -or [string]$managedProperty.RefinerConfiguration.Type -ne $node.RefinerType)
            {
                LogWrite -logMessage ("{0}: Proceeding to make changes in Managed Property" -f $node.Name) -logFile $logFile
                if(-Not $managedProperty)
                {
                    LogWrite -logMessage ("{0}: Failed to make changes in Managed Property" -f $node.Name) -logFile $logFile
                }
                else 
                {
                    try 
                    {
                        $managedProperty.RemoveDuplicates = [int]$node.RemoveDuplicates -as [bool]
                        $managedProperty.NoWordBreaker = [int]$node.NoWordBreaker -as [bool]
                        $managedProperty.FullTextQueriable = [int]$node.FullTextQueriable -as [bool]
                        $managedProperty.EnabledForScoping = [int]$node.EnabledForScoping -as [bool]
                        $managedProperty.SafeForAnonymous = [int]$node.SafeForAnonymous -as [bool]
                        $managedProperty.NameNormalized = [int]$node.NameNormalized -as [bool]
                        $managedProperty.RespectPriority = [int]$node.RespectPriority -as [bool]
                        $managedProperty.Retrievable = [int]$node.Retrievable -as [bool]
                        $managedProperty.Queryable = [int]$node.Queryable -as [bool]
                        $managedProperty.Searchable = [int]$node.Searchable -as [bool]
                        $managedProperty.Sortable = [int]$node.Sortable -as [bool]
                        $managedProperty.Refinable = [int]$node.Refinable -as [bool]
                        $managedProperty.HasMultipleValues = [int]$node.HasMultipleValues -as [bool]
                        $managedProperty.TokenNormalization = [int]$node.TokenNormalization -as [bool]
                        if($node.SortableType -ne ''-and $managedProperty.Sortable -eq $true)
                        {
                            $managedProperty.SortableType = $node.SortableType
                        }
                        if($node.RefinerType -ne '' -and $managedProperty.Refinable -eq $true)
                        {
                            $managedProperty.RefinerConfiguration.Type = $node.RefinerType
                        }
                    }
                    catch 
                    {
                        LogWrite -logMessage ("### ERROR ### {0}: Failed to stage editing of Managed Property with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
                    }
                    # EDITING MANAGED PROPERTY WITH PARAMETERS ABOVE
                    try 
                    {
                        $managedProperty.Update()   
                    }
                    catch 
                    {
                        LogWrite -logMessage ("### ERROR ### {0}: Failed to commit edit of Managed Property with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
                    }
                    LogWrite -logMessage ("{0}: Edited Managed Property" -f $node.Name) -logFile $logFile
                    LogWrite -logMessage ("{0}: {1}" -f $node.Name,$managedProperty) -logFile $logFile
                }
            } 
            else
            {
                LogWrite -logMessage ("{0}: Managed Property is the same, no changes made" -f $node.Name) -logFile $logFile
            }
        }
        ####### ADDING MAPPING OF CRAWLED PROPERTIES ############
        $crawledProperties = @()    # ARRAY OF CRAWLED PROPERTIES TO MAP TO MANAGED PROPERTY
        LogWrite -logMessage ("{0}: Loading Crawled Properties from XML" -f $node.Name) -logFile $logFile
        $crawledPropertiesXML = $nodeSchema.SelectNodes("//ManagedProperty[@Name='$name']/CrawledPropertiesList/AddedCrawlProperty")
        foreach($nodeProperty in $crawledPropertiesXML) # FOREACH ADD CRAWL PROPERTY IN XML
        {
            try 
            {
                $cat = Get-SPEnterpriseSearchMetadataCategory -SearchApplication $node.SearchApplication -Identity $nodeProperty.Category -ErrorAction SilentlyContinue   # GETTING CATEGORY
                if(-Not $cat)
                {
                    LogWrite -logMessage ("{0}: Failed to load Category {1} for Crawl Rule {2}" -f $node.Name, $nodeProperty.Category, $nodeProperty.Name) -logFile $logFile
                }
                else 
                {
                    LogWrite -logMessage ("{0}: Loading Crawl Rule {1} of Category {2}" -f $node.Name, $nodeProperty.Name, $nodeProperty.Category) -logFile $logFile
                    $crawledProp = Get-SPEnterpriseSearchMetadataCrawledProperty -SearchApplication $node.SearchApplication -Category $cat -Name $nodeProperty.Name -ErrorAction SilentlyContinue
                    if(-Not $crawledProp)
                    {
                        LogWrite -logMessage ("{0}: Failed to load Crawl Rule {1}" -f $node.Name, $nodeProperty.Name) -logFile $logFile
                    }
                    else 
                    {
                        LogWrite -logMessage ("{0}: Loaded Crawl Property {1}" -f $node.Name,$nodeProperty.Name) -logFile $logFile
                        $crawledProperties += $crawledProp 
                        LogWrite -logMessage ("{0}: Added Crawl Property {1} to List of Crawl Properties to Map" -f $node.Name, $nodeProperty.Name) -logFile $logFile
                    }
                }   
            }
            catch 
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to add Crawled Properties to be mapped to Managed Property with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
            }
        }
        # IF THERE ARE CRAWLED PROPERTIES TO MAP AND THERE IS MANAGED PROPERTY
        if($crawledProperties -ne $null -and $managedProperty -ne $null)
        {
            try 
            {
                for($i=0; $i -le $crawledProperties.Count-1; $i++)  # FOREACH ELEMENT IN CRAWLED PROPERTIES ARRAY
                {
                    LogWrite -logMessage ("{0}: Mapping Crawled Property {1}" -f $node.Name, $crawledProperties[$i].Name) -logFile $logFile
                    if((Get-SPEnterpriseSearchMetadataMapping -CrawledProperty $crawledProperties[$i] -ManagedProperty $managedProperty -SearchApplication $node.SearchApplication) -eq $null)
                    {
                        # MAPPING 
                        New-SPEnterpriseSearchMetadataMapping -CrawledProperty $crawledProperties[$i] -ManagedProperty $managedProperty -SearchApplication $node.SearchApplication -ErrorAction SilentlyContinue
                        LogWrite -logMessage ("{0}: Mapped Crawled Property {1}" -f $node.Name,$crawledProperties[$i].Name) -logFile $logFile       
                    }
                    else 
                    {
                        LogWrite -logMessage ("{0}: Given Crawl Property {1} mapping already exists" -f $node.Name,$crawledProperties[$i].Name) -logFile $logFile
                    }
                }   
            }
            catch 
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to add mapping Crawled Properties to Managed Property with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
            }
        }
        ######## REMOVING MAPPINGS OF CRAWLED PROPERTIES ############
        $crawledPropertiesToRemove = @()    # ARRAY OF CRAWLED PROPERTIES TO REMOVE FROM MAPPING TO MANAGED PROPERTY
        LogWrite -logMessage ("{0}: Loading Crawled Properties to remove. From XML" -f $node.Name) -logFile $logFile
        $crawledPropertiesToRemoveXML = $node.SelectNodes("//SearchSchema/ManagedProperty[@Name='$name']/CrawledPropertiesList/RemovedCrawlProperty")
        foreach($nodeProperty in $crawledPropertiesToRemoveXML) # FOREACH REMOVE CRAWL PROPERTY IN XML
        {
            try
            {
                $cat = Get-SPEnterpriseSearchMetadataCategory -SearchApplication $node.SearchApplication -Identity $nodeProperty.Category -ErrorAction SilentlyContinue   # GETTING CATEGORY
                if(-Not $cat)
                {
                    LogWrite -logMessage ("{0}: Failed to load Category {1} for Crawl Rule {2}" -f $node.Name, $nodeProperty.Category, $nodeProperty.Name) -logFile $logFile
                }
                else 
                {
                    LogWrite -logMessage ("{0}: Loading Crawl Rule {1} of Category {2}" -f $node.Name, $nodeProperty.Name, $nodeProperty.Category) -logFile $logFile
                    $crawledProp = Get-SPEnterpriseSearchMetadataCrawledProperty -SearchApplication $node.SearchApplication -Category $cat -Name $nodeProperty.Name -ErrorAction SilentlyContinue               
                    if(-Not $crawledProp)
                    {
                        LogWrite -logMessage ("{0}: Failed to load Crawl Rule {1}" -f $node.Name, $nodeProperty.Name) -logFile $logFile
                    }
                    else 
                    {
                        LogWrite -logMessage ("{0}: Loaded Crawl Property {1}" -f $node.Name,$nodeProperty.Name) -logFile $logFile
                        $crawledPropertiesToRemove += $crawledProp 
                        LogWrite -logMessage ("{0}: Added Crawl Property {1} to List of Crawl Properties to remove mapping" -f $node.Name, $nodeProperty.Name) -logFile $logFile
                    }
                }
            }
            catch
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to remove Crawled Properties to map to Managed Property with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile
            }
        }
        # IF THERE ARE CRAWLED PROPERTIES TO REMOVE MAPPING AND THERE IS MANAGED PROPERTY
        if($crawledPropertiesToRemove -ne $null -and $managedProperty -ne $null)
        {
            try 
            {
                for($i=0; $i -le $crawledPropertiesToRemove.Count-1; $i++)
                {
                    $mapToRemove = Get-SPEnterpriseSearchMetadataMapping -CrawledProperty $crawledPropertiesToRemove[$i] -ManagedProperty $managedProperty -SearchApplication $node.SearchApplication
                    LogWrite -logMessage ("{0}: Removing mapping of Crawled Property {1}" -f $node.Name, $crawledPropertiesToRemove[$i].Name) -logFile $logFile  
                    # REMOVE OF MAPPING
                    Remove-SPEnterpriseSearchMetadataMapping -Identity $mapToRemove -SearchApplication $node.SearchApplication -ErrorAction Continue -Confirm:$false
                    LogWrite -logMessage ("{0}: Removed mapping of Crawled Property {1}" -f $node.Name, $crawledPropertiesToRemove[$i].Name) -logFile $logFile
                }
            }
            catch 
            {
                LogWrite -logMessage ("### ERROR ### {0}: Failed to remove mapping of Crawled Properties with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile    
            } 
        }
        LogWrite -logMessage ("{0}: Crawled properties completed" -f $node.Name) -logFile $logFile
    }
}

function ResultSource($nodes)
{
    LogWrite -logMessage ("Stepped into ResultSource function") -logFile $logFile
    foreach($node in $nodes) #FOREACH RESULT SOURCE IN RESULT SOURCES
    {
        try 
        {
            if(Get-SPEnterpriseSearchServiceApplication -Identity $node.SearchApplication -ErrorAction SilentlyContinue)
            {
                LogWrite -logMessage ("Selected Result Source: {0}" -f $node.Name) -logFile $logFile
                $ssa = Get-SPEnterpriseSearchServiceApplication -Identity $node.SearchApplication
                LogWrite -logMessage ("{0}: Search Service Application: {1}" -f $node.Name, $node.SearchApplication) -logFile $logFile
                $fedManager = New-Object Microsoft.Office.Server.Search.Administration.Query.FederationManager($ssa)
                LogWrite -logMessage ("{0}: Created new Federation Manager" -f $node.Name) -logFile $logFile
                $searchOwner = Get-SPEnterpriseSearchOwner -Level Ssa
                LogWrite -logMessage ("{0}: Received Search Service Owner" -f $node.Name) -logFile $logFile
                $actualResultSource =  $fedManager.GetSourceByName(('{0}' -f $node.Name), $searchOwner)
                LogWrite -logMessage ("{0}: Received actual Result Source: {1}" -f $node.Name, $actualResultSource -as [string]) -logFile $logFile
                $qT = $node.QueryTransform
                LogWrite -logMessage ("{0}: Loaded Query Transform from XML: {1}" -f $node.Name, $node.QueryTransform) -logFile $logFile
                if(-Not $actualResultSource) 
                {
                    # PASSED RESULT SOURCE DOESN'T EXIST
                    # CREATING A NEW ONE
                    LogWrite -logMessage ("{0}: Passed Result Source doesn't exist" -f $node.Name) -logFile $logFile
                    LogWrite -logMessage ("{0}: Proceeding to create new Result Source" -f $node.Name) -logFile $logFile
                    $resultSource = ''
                    $resultSource = $fedManager.CreateSource($searchOwner)
                    if(-Not $resultSource)
                    {
                        LogWrite -logMessage ("{0}: Failed to create new Result Source" -f $node.Name) -logFile $logFile
                    }
                    else
                    {
                        $rsTypeXml = $node.Type
                        $rsType = ''
                        $rsRemoteUrl = ''
                        if($rsTypeXml -eq 'Remote') 
                        {
                            $rsType = $fedManager.ListProviders()['Remote SharePoint Provider'].Id 
                            $rsRemoteUrl = $node.RemoteUrl
                        } 
                        elseif($rsTypeXml -eq 'RemotePeople')
                        {
                             $rsType = $fedManager.ListProviders()['Remote People Provider'].Id 
                             $rsRemoteUrl = $node.RemoteUrl
                        } 
                        elseif($rsTypeXml -eq 'Local') 
                        {
                            $rsType = $fedManager.ListProviders()['Local SharePoint Provider'].Id
                        }
                        elseif($rsTypeXml -eq 'LocalPeople') 
                        {
                            $rsType = $fedManager.ListProviders()['Local People Provider'].Id
                        } 
                        elseif($rsTypeXml -eq 'Open') 
                        {
                            $rsType = $fedManager.ListProviders()['OpenSearch Provider'].Id
                        } 
                        elseif($rsTypeXml -eq 'Exchange') 
                        {
                            $rsType = $fedManager.ListProviders()['Exchange Search Provider'].Id 
                        }
                        $resultSource.Name =$node.Name
                        $resultSource.ProviderId = $rsType
                        $resultSource.ConnectionUrlTemplate = $rsRemoteUrl
                        $resultSource.Description = $node.Description
                        $resultSource.CreateQueryTransform($qT)
                        $resultSource.Commit()
                        LogWrite -logMessage ("{0}: Created new Result Source" -f $node.Name) -logFile $logFile
                        LogWrite -logMessage ("{0}: {1}" -f $node.Name, $resultSource) -logFile $logFile
                    }
                }
                else 
                {
                    # EDITING EXISTING RESULT SOURCE
                    LogWrite -logMessage ("{0}: Passed Result Source exists" -f $node.Name) -logFile $logFile
                    if($actualResultSource.QueryTransform.QueryTemplate -ne $qT)
                    {
                        LogWrite -logMessage ("{0}: Passed Result Source is different than actual" -f $node.Name) -logFile $logFile
                        LogWrite -logMessage ("{0}: Proceeding to make changes" -f $node.Name) -logFile $logFile
                        $node.Name
                        $rsTypeXml = $node.Type
                        $rsType = ''
                        $rsRemoteUrl = ''
                        if($rsTypeXml -eq 'Remote') 
                        {
                            $rsType = $fedManager.ListProviders()['Remote SharePoint Provider'].Id 
                            $rsRemoteUrl = $node.RemoteUrl
                        } 
                        elseif($rsTypeXml -eq 'RemotePeople')
                        {
                             $rsType = $fedManager.ListProviders()['Remote People Provider'].Id 
                             $rsRemoteUrl = $node.RemoteUrl
                        } 
                        elseif($rsTypeXml -eq 'Local') 
                        {
                            $rsType = $fedManager.ListProviders()['Local SharePoint Provider'].Id
                        }
                        elseif($rsTypeXml -eq 'LocalPeople') 
                        {
                            $rsType = $fedManager.ListProviders()['Local People Provider'].Id
                        } 
                        elseif($rsTypeXml -eq 'Open') 
                        {
                            $rsType = $fedManager.ListProviders()['OpenSearch Provider'].Id
                        } 
                        elseif($rsTypeXml -eq 'Exchange') 
                        {
                            $rsType = $fedManager.ListProviders()['Exchange Search Provider'].Id 
                        }
                        $actualResultSource.Name =$node.Name
                        $actualResultSource.ProviderId = $rsType
                        $actualResultSource.ConnectionUrlTemplate = $rsRemoteUrl
                        $actualResultSource.Description = $node.Description
                        $actualResultSource.CreateQueryTransform($qT)
                        $actualResultSource.Commit() 
                        LogWrite -logMessage ("{0}: Changes made to Result Source" -f $node.Name) -logFile $logFile
                        LogWrite -logMessage ("{0}: {1}" -f $node.Name, $actualResultSource) -logFile $logFile
                    }
                    else
                    {
                        LogWrite -logMessage ("{0}: Passed Result Source is same as actual" -f $node.Name) -logFile $logFile
                    }
                }
            } else {
                LogWrite -logMessage ("No Result Source found") -logFile $logFile
            }  
        }
        catch 
        {
            LogWrite -logMessage ("### ERROR ### {0}: Failed to add/modify Result Source with exception: '{1}'" -f $node.Name, $_.Exception.Message) -logFile $logFile    
        }
        
    }
}

function Crawl ($nodes, $time)
{
    try 
    {
        LogWrite -logMessage ("Stepped into Crawl function with parameter 'Time' set to {0}" -f $time) -logFile $logFile
        $csToCrawlList = [System.Collections.ArrayList]@()    # LIST OF CONTENT SOURCES TO CRAWL
        foreach($node in $nodes)    # FOREACH CONTENT SOURCE IN XML 
        {
            $name = $node.Name
            if($node.Name -ne '')
            {
                LogWrite -logMessage ("{0}: Loading Content Source to add for Crawl" -f $node.Name) -logFile $logFile
                $csToCrawl = Get-SPEnterpriseSearchCrawlContentSource -SearchApplication $node.SearchApplication -Identity $node.Name -ErrorAction Continue   # GET CONTENT SOURCE
                LogWrite -logMessage ("{0}: Loaded Content Source to add for Crawl" -f $node.Name) -logFile $logFile
                if(-Not $csToCrawl)
                {
                    LogWrite -logMessage ("{0}: Failed to load Content Source" -f $node.Name) -logFile $logFile
                }
                else 
                {
                    if($csToCrawl.CrawlState -ne "Idle")
                    {
                        LogWrite -logMessage ("{0}: Content Source is not in Idle state" -f $node.Name) -logFile $logFile
                        $csToCrawl.StopCrawl()
                        LogWrite -logMessage ("{0}: Stopping actual crawl" -f $node.Name) -logFile $logFile
                        while($csToCrawl.CrawlState -ne "Idle")
                            {}
                    }
                    if($time -ne $null) # IF TIME IS SET TO SPECIFIC AMOUNT OF SECONDS
                    {
                        LogWrite -logMessage ("{0}: Crawl State of Content Source is Idle" -f $node.Name) -logFile $logFile
                        LogWrite -logMessage ("{0}: Starting Full Crawl for {1} seconds" -f $node.Name, [int]$time) -logFile $logFile
                        $csToCrawl.StartFullCrawl() # START FULL CRAWL
                        $csToCrawlList.Add($csToCrawl) # LIST OF CONTENT SOURCES BEING CRAWLED
                    }
                    elseif($time -eq $null) # ELSE THE TIME IS SET TO NULL
                    {
                        if($node.CrawlSetting -eq 'Full')
                        {
                            LogWrite -logMessage ("{0}: Crawl State of Content Source is Idle" -f $node.Name) -logFile $logFile
                            LogWrite -logMessage ("{0}: Starting Full Crawl" -f $node.Name) -logFile $logFile
                            $csToCrawl.StartFullCrawl() # START FULL CRAWL
                        }
                        elseif($node.CrawlSetting -eq 'Incremental')
                        {
                            LogWrite -logMessage ("{0}: Crawl State of Content Source is Idle" -f $node.Name) -logFile $logFile
                            LogWrite -logMessage ("{0}: Starting Incremental Crawl" -f $node.Name) -logFile $logFile
                            $csToCrawl.StartIncrementalCrawl() # START INCREMENTAL CRAWL
                        }
                    }
                    while($csToCrawl.CrawlState -eq "Idle")
                        {}
                }
                
            }
            elseif($node.Name -eq '')
            {
                LogWrite -logMessage ("{0}: No Content Source to crawl" -f $node.Name) -logFile $logFile
            }
            else
            {
                LogWrite -logMessage ("{0}: There was some error in running crawl" -f $node.Name) -logFile $logFile
            }
        }
    }
    catch 
    {
        LogWrite -logMessage ("### ERROR ### Failed to Run crawl with exception: '{0}'" -f $_.Exception.Message) -logFile $logFile  
    }

    try 
    {
        if($time -ne $null -and $csToCrawlList -ne '')
        {
            LogWrite -logMessage ("Starting Thread Sleep for {0} seconds to allow Crawl to run" -f $time) -logFile $logFile
            Start-Sleep -s $time    # SLEEP SCRIPT TO ALLOW FULL CRAWL TO RUN
            LogWrite -logMessage ("Thread Sleep is over") -logFile $logFile
            foreach($cs in $csToCrawlList)  # FOREACH CONTENT SOURCES THAT ARE BEING CRAWLED
            {
                LogWrite -logMessage ("{0}: Stopping Crawl" -f $cs.Name) -logFile $logFile
                $cs.StopCrawl() # STOP CRAWL
            }
            foreach($cs in $csToCrawlList)
            {
                while($cs.CrawlState -ne "Idle")
                    {}
            }
        }
    }
    catch 
    {
        LogWrite -logMessage ("### ERROR ### Failed to start Thread Sleep for Crawl Run with exception: '{0}'" -f $_.Exception.Message) -logFile $logFile  
    }
    
}

function ZeroCheck($obj)  
{
    if($obj -eq '0')
    {
        [int]$newObj = 0
    }
    return $newObj
}

function ListAllLOBSystems($node)    # LISTING ALL LINE OF BUSINESS SYSTEMS
{
    LogWrite -logMessage ("Listing all LOB Systems") -logFile $logFile
    try 
    {
        $LobSystems = Get-SPBusinessDataCatalogMetadataObject -ErrorAction SilentlyContinue -ServiceContext $node.ServiceContext -BdcObjectType LobSystem -Name * | Format-Table -Property LobSystemInstances | Out-String
        $LobSystems
        LogWrite -logMessage ("Lob Systems list: {0}" -f $LobSystems) -logFile $logFile
        LogWrite -logMessage ("All LOB Systems listed") -logFile $logFile
    }
    catch 
    {
        LogWrite -logMessage ("Failed to list all LOB Systems: Exception Message: {0}, Exception Item Name: {1}" -f $_.Exception.Message, $_.Exception.ItemName) -logFile $logFile
    }
}  


<###################### START OF SCRIPT ##########################>
try
{
    $dir = "$PsScriptRoot\"
    New-Item $dir -type Directory -ErrorAction SilentlyContinue
    [string]$logPath = $dir     ##### PATH OF LOG
    $date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $logFile = $logPath + $date + "_DeployScriptLog.log"
    LogWrite -logMessage ("########## Starting script ##########") -logFile $logFile
    <###################### POWERSHELL SNAPIN #########################> 
    LogWrite -logMessage ("Checking Microsoft.Sharepoint.PowerShell") -logFile $logFile
    if((Get-PSSnapin "Microsoft.SharePoint.PowerShell" -ErrorAction SilentlyContinue) -eq $null)
    {
        LogWrite -logMessage ("Adding Microsoft.SharePoint.Powershell") -logFile $logFile
        Add-PSSnapin Microsoft.SharePoint.PowerShell
        LogWrite -logMessage ("Microsoft.Sharepoint.PowerShell installed") -logFile $logFile
    }
    else
    {
        LogWrite -logMessage "Microsoft.Sharepoint.PowerShell is already installed" -logFile $logFile
    }
    <########################### LOAD XML ################################>
    LogWrite -logMessage ("Loading XML file") -logFile $logFile
    $xmlDir = "$PsScriptRoot\DeployScriptData.xml" ##### PATH TO XML FILE WITH DATA
    try 
    {
        [string]$path = $xmlDir ##### DIRECTORY OF THE XML FILE WITH DATA
        [xml]$xmlDoc = Get-Content $path
        LogWrite -logMessage ("XML File {0} loaded from directory: {1}" -f $path, $xmlDir) -logFile $logFile
    }
    catch 
    {
        LogWrite -logMessage ("### ERROR ### XML File failed to load with error message {0}" -f $_.Exception.Message) -logFile $logFile
        break
    }
    
    <############################## CONTENT SOURCE ###################################>
    LogWrite -logMessage ("Loading Content Source nodes") -logFile $logFile
    foreach($cs in $xmlDoc.SelectNodes("//ContentSource"))
    {
        LogWrite -logMessage ("Loaded Content Sources from XML: '{0}'" -f $cs.Name)  -logFile $logFile
    }
    CheckContentSources $xmlDoc.SelectNodes("//ContentSource") #CHECK IF CONTENT SOURCE EXISTS 
    LogWrite -logMessage ("Stepped out of CheckContentSource function") -logFile $logFile
    <############################ CRAWL RULES ##########################################>
    ManageCrawlRules $xmlDoc.SelectNodes("//CrawlRulesList/CrawlRule")
    LogWrite -logMessage ("Stepped out of ManageCrawlRules function") -logFile $logFile
    <############################ CRAWL ##########################################> 
    if($xmlDoc.SelectNodes("//ContentSource" -ne ''))
    {
        LogWrite -logMessage ("Stepping into (run)Crawl function") -logFile $logFile
        [Nullable[int]]$seconds = 350
        Crawl $xmlDoc.SelectNodes("//ContentSource") $seconds
        LogWrite -logMessage ("Stepped out of (run)Crawl function") -logFile $logFile
    }
    <######################## SEARCH SCHEMA #####################################>
    SearchSchema $xmlDoc.SelectNodes("//SearchSchema")
    LogWrite -logMessage ("Stepped out of SearchSchema function") -logFile $logFile
    <####################### RESULT SOURCE ###################################>
    ResultSource $xmlDoc.SelectNodes("//ResultSource")
    LogWrite -logMessage ("Stepped out of ResultSource function") -logFile $logFile
}
catch
{
    LogWrite -logMessage ("Error. Something went wrong. Error message = {0}. In = {1}" -f $_.Exception.Message, $_.Exception.ItemName) -logFile $logFile
}
finally
{
    MailLog($logFile)
    ArchiveFiles($date)
}
