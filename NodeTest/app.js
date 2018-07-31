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
    sfConnection.query("SELECT Name FROM Account", (err, result) => {
        if(err) { return console.error(err) };

        let allowCreation = true;

        for(let i = 0; i < result.records.length; i++)
        {
            if((result.records[i])["Name"] === newAccount["Name"])
            {
                allowCreation = false;
                break;
            }
        }

        if(allowCreation) sfConnection.create("Account", newAccount);
    });
}

function createLead(sfConnection, parameterObject)
{
    let newLead = {
        attributes: {
            type: 'Lead'
        },
        LastName: parameterObject["Last Name"],
        Company: parameterObject["Company"],
        LeadSource: parameterObject["Lead Source"],
        Status: parameterObject["Lead Status"]
    }

    sfConnection.query("SELECT LastName FROM Lead", (err, result) => {
        if(err) { return console.error(err) };

        for(let i = 0; i < result.records.length; i++)
        {
            if((result.records[i])["LastName"] === newLead["LastName"])
            {
                console.log("Lead Would have been duplicate");
                return;
            }
        }

        sfConnection.create("Lead", newLead);
    });
}

function initializeServer()
{
    let http = require('http');
    let url = require('url');
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

                    if(inputData.hasOwnProperty("accountData"))
                    {
                        console.log("Getting Ready to Make Account");
                        let accountData = JSON.parse(inputData["accountData"]);
                        accountData = accountData[0];

                        loginToSalesforce(conn, createAccount, accountData);
                    }
                    else if(inputData.hasOwnProperty("leadData"))
                    {
                        console.log("Getting Ready to Make Lead")
                        let leadData = JSON.parse(inputData["leadData"]);
                        leadData = leadData[0];

                        loginToSalesforce(conn, createLead, leadData);
                    }
                })    
            }
            else
            {  }
    
            res.end();
        }
    }).listen(8080);
}

initializeServer();