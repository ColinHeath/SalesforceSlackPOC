function loginToSalesforce(sfConnection, methodOnLogin, paramObject)
{
    //Add config readin for user credentials.
    sfConnection.login((err, userInfo) => {
        if(err) { return console.error(err); }
        console.log(sfConnection.accessToken);
        console.log(sfConnection.instanceUrl);

        methodOnLogin(sfConnection, paramObject);
    })
}

function createAccount(sfConnection, accountObject)
{
    //Need to query salesforce, make sure no account with this name already exists.
    sfConnection.query("SELECT Id, Name FROM Account", (err, result) => {
        if(err) { return console.error(err) };

        for(let i = 0; i < result.records.length; i++)
        {
            if((result.records[i])["Name"] === accountObject["Name"])
            {
                console.log("entered false return");
                return;
            }
        }

        sfConnection.create("Account", accountObject);
    });
}

let http = require('http');
let url = require('url');
let jsforce = require('jsforce');

http.createServer((req, res) => {
    if(req.url != '/favicon.ico')
    {
        res.writeHead(200, {'Content-Type': 'application/json'});
    
        let conn = new jsforce.Connection({
            loginUrl : 'https://test.salesforce.com'
        });
        
        let newAccount = {
            attributes: {type: 'Account'},
            Name: 'Colin\'s Cool Corporation'
        };

        res.write(JSON.stringify(newAccount));

        loginToSalesforce(conn, createAccount, newAccount);
    
        res.end();
    }
}).listen(8080);