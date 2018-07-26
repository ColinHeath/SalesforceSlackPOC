let http = require('http');
let url = require('url');
let jsforce = require('jsforce');

http.createServer((req, res) => {
    if(req.url != '/favicon.ico')
    {
        res.writeHead(200, {'Content-Type': 'text/html'});
    
        let queryValues = url.parse(req.url, true).query;
    
        let conn = new jsforce.Connection({
            loginUrl : 'https://test.salesforce.com'
        });
        
        //DO NOT LEAVE PLAINTEXT CREDENTIALS IN
        conn.login(/*user*/, /*pass*/, (err, userInfo) => {
            if(err) { return console.error(err); }
            console.log(conn.accessToken);
            console.log(conn.instanceUrl);
    
            console.log("User ID: " + userInfo.id);
            console.log("Org ID: " + userInfo.organizationId);
        
            conn.query("SELECT Id, Name FROM Account", (err, result) => {
                if(err) { return console.error(err) };
                console.log("total : " + result.totalSize);
                console.log("fetched : " + result.records.length);
                console.log(result.records[0]);

            });

            conn.create("Account", { 
                attributes: { type: 'Account' },
                Name: 'Ten-Ten' 
            });
        });
    
        res.end();
    }
}).listen(8080);

