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

function createAccount(sfConnection, accountObject)
{
    let newAccount = {
        attributes: { type: 'account' },
        Name: accountObject["Account Name"]
    };

    //Need to query salesforce, make sure no account with this name already exists.
    sfConnection.query("SELECT Id, Name FROM Account", (err, result) => {
        if(err) { return console.error(err) };

        for(let i = 0; i < result.records.length; i++)
        {
            if((result.records[i])["Name"] === newAccount["Name"])
            {
                console.log("entered false return");
                return;
            }
        }

        sfConnection.create("Account", newAccount);
    });
}

function printAllLeads(sfConnection, parameterObject)
{
    sfConnection.query("SELECT Name, Company, Status FROM Lead", (err, result) => {
        if(err) { return console.error(err) };

        for(let i = 0; i < result.records.length; i++)
        {
            console.log(result.records[i]);
        }
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

                    console.log(inputData);
                    /*let accountData = JSON.parse(body["input_data"]["accountData"]);
                    accountData = accountData[0];
    
                    loginToSalesforce(conn, createAccount, accountData);*/
                })    
            }
            else
            { 
                loginToSalesforce(conn, printAllLeads, null);
            }
    
            res.end();
        }
    }).listen(8080);
}

initializeServer();