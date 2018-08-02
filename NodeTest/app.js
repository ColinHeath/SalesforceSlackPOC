function loginToSalesforce(sfConnection, methodOnLogin, paramObject)
{
    var credentials = require('./config.json');

    //Add config readin for user credentials.
    sfConnection.login(credentials["User"], (credentials["Pass"] + credentials["Key"]) , (err, userInfo) => {
        if(err) { return console.error(err); }
        console.log(sfConnection.accessToken);
        console.log(sfConnection.instanceUrl);

        methodOnLogin(sfConnection, paramObject);
    });
}

function createAccount(sfConnection, parameterObject)
{
    let newAccount = {
        attributes: { type: 'account' },
        Name: parameterObject["Account Name"]
    };

    //Need to query salesforce, make sure no account with this name already exists.
    sfConnection.sobject("Account")
        .select('*')
        .execute((err, records) => {
            if(err) { return console.error(err) };

            let creationAllowed = checkForDuplicateObjects(records, newAccount);

            console.log("Allowed: " + creationAllowed);

            if(creationAllowed) sfConnection.create("Account", newAccount);

            console.log("After creation or not");

            return;
        });

    console.log("Leaving Account Creation");
    return;
}

function checkForDuplicateObjects(objectRecords, objectToCheck)
{
    let allowCreation = true;

    for(let i = 0; i < objectRecords.length; i++)
    {
        let areIdentical = true;

        for(let property in objectToCheck)
        {
            if(objectRecords[i].hasOwnProperty(property) && objectToCheck.hasOwnProperty(property))
            {
                if(property != "attributes")
                {
                    console.log(property);
                    console.log(objectRecords[i][property]);
                    console.log(objectToCheck[property]);

                    if(objectRecords[i][property] != null && objectToCheck[property] != null)
                    {
                        areIdentical = areIdentical && (objectRecords[i][property] == objectToCheck[property]);
                    }

                    console.log("Identical: " + areIdentical);
                }
            }
        }

        if(areIdentical)
        {
            allowCreation = false;
            break;
        }
    }

    return (allowCreation);
}

function switchSalesforceAction(sfConnection, inputData)
{
    if(inputData == null)
    {
        return;
    }
    else if(inputData.hasOwnProperty("convertData"))
    {
        console.log("Getting Ready to Convert Lead");
        let convertData = JSON.parse(inputData["convertData"]);
        convertData = convertData[0];

        loginToSalesforce(sfConnection, convertLead, convertData);
    }
    else if(inputData.hasOwnProperty("accountData"))
    {
        console.log("Getting Ready to Make Account");
        let accountData = JSON.parse(inputData["accountData"]);
        accountData = accountData[0];

        loginToSalesforce(sfConnection, createAccount, accountData);
    }
    else if(inputData.hasOwnProperty("leadData"))
    {
        console.log("Getting Ready to Make Lead")
        let leadData = JSON.parse(inputData["leadData"]);
        leadData = leadData[0];

        loginToSalesforce(sfConnection, createLead, leadData);
    }
}

function convertLead(sfConnection, parameterObject)
{
    /*
        -Account Name
        -Record Owner
        -Converted Status
    */

    /*
        -convertedStatus
        -leadId --> end required
        -accountId
        -contactId
        -doNotCreateOpportunity
        -opportunityName
        -overwriteLeadSource
        -ownerId
        -sendNotificationEmail
    */
    console.log("In Function");
    sfConnection.sobject("Lead")
        .select('Name, Company, Id')
        .execute((err, records) => {
            if(err) { console.error(err) };

            console.log("Behind Select");
            let leadObjectToConvert = null;

            for(let i = 0; i < records.length; i++)
            {
                console.log("Lead Name: " + records[i]["Name"]);
                if(records[i]["Name"] == parameterObject["Lead Name"])
                {
                    leadObjectToConvert = records[i];
                    break;
                }
            }

            if(leadObjectToConvert != null)
            {
                let accountObject = {
                    "Account Name": leadObjectToConvert["Company"]
                }

                createAccount(sfConnection, accountObject);
                let convertedAccountId = null;

                sfConnection.sobject("Account")
                    .select("Id, Name")
                    .execute((err, accountRecords) => {
                        if(err) { return console.error(err) };

                        for(let i = 0; i < accountRecords.length; i++)
                        {
                            if(accountRecords[i]["Name"] == accountObject["Account Name"])
                            {
                                convertedAccountId = accountRecords[i]["Id"];
                            }
                        }

                        if(accountId)
                        {
                            let leadConvert = {
                                convertedStatus: parameterObject["Converted Status"],
                                leadId: leadObjectToConvert["Id"],
                                opportunityName: parameterObject["Opportunity Name"],
                                doNotCreateOpportunity: false,
                                accountId: convertedAccountId
                            }

                            sfConnection.soap.convertLead(leadConvert, (err, result) => {
                                if(err) { return console.error(err) };
                                console.log("Success? " + result.success);
                                console.log("New Opportunity ID: " + result.opportunityId);
                            })
                        }
                    })
            }
        });

    /*    let soap = new SoapApi(sfConnection);

    soap.convertLead()*/
}

function createLead(sfConnection, parameterObject)
{
    let newLead = {
        attributes: {
            type: 'Lead'
        },
        LastName: parameterObject["Lead Name"],
        Company: parameterObject["Company"],
        LeadSource: parameterObject["Lead Source"],
        Status: parameterObject["Lead Status"]
    }

    sfConnection.sobject("Lead")
        .select('*')
        .execute((err, records) => {
            if(err) { return console.error(err) };

            let creationAllowed = checkForDuplicateObjects(records, newLead);

            console.log("Allowed: " + creationAllowed);

            if(creationAllowed) sfConnection.create("Lead", newLead);
        })
}

function initializeServer()
{
    let http = require('http');
    let jsforce = require('jsforce');

    let conn = new jsforce.Connection({
        loginUrl : 'https://test.salesforce.com'
    });

    http.createServer((req, res) => {
        if(req.url != '/favicon.ico')
        {
            res.writeHead(200, {'Content-Type': 'application/json'});
    
            if(req.method == "POST")
            {
                console.log("POST Request");
    
                let body = "";
                req.on('data', (chunk) => {
                    body += chunk;
                }).on('end', () => {
                    body = JSON.parse(body);
                    
                    let inputData = body["input_data"];

                    console.log(inputData);

                    switchSalesforceAction(conn, inputData);
                })
            }
            else
            {
                switchSalesforceAction(conn, null);
            }
            res.end();
        }
    }).listen(8080);
}

initializeServer();