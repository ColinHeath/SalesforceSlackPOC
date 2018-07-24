/*function retrieveHashValues()
{
    let urlHash = window.location.hash.substr(1);
    let hashParamObject = urlHash.split('&').reduce((result, item) => {
        let keyValuePair = item.split('=');
        result[keyValuePair[0]] = keyValuePair[1];
        return result;
    }, {});

    return hashParamObject;
}

function resetCurrentURL()
{
    window.location.hash = "";
    window.location.replace(window.location.href);
}

function redirectForAuthToken() //TODO: Make this read from config file, not plaintext client_id
{
    let protocol = "https://"
    let redirectURL = "test.salesforce.com/services/oauth2/authorize";
    let paramObject = {
        response_type: "token",
        client_id: "3MVG9FS3IyroMOh6n9lxAQusceSBzSXmXtR5WRAAlk7clyvBs2cYAmxlFiDwj38Nf2aQMG8Ieft5kH9t.T_RR",
        redirect_uri: "https://0bfa6ae2.ngrok.io"
    }

    redirectURL += "?response_type=" + paramObject.response_type;
    redirectURL += "&client_id=" + paramObject.client_id;
    redirectURL += "&redirect_uri=" + paramObject.redirect_uri;
    redirectURL = (protocol) + (redirectURL);

    window.location.replace(redirectURL);
}

function checkAuthenticationAndRetry(sfAccessToken, sfAuthCount)
{   
    if((sfAccessToken == null || sfAccessToken == ''))
    {
        if(sfAuthCount < 3)
        {
            sessionStorage.setItem('sfAuthCount', ++sfAuthCount);
        
            let hashParamObject = retrieveHashValues();
            
            if(hashParamObject['access_token'] != null && hashParamObject['access_token'] != '')
            {
                sessionStorage.setItem('sfAccessToken', hashParamObject['access_token']);
                resetCurrentURL();
                return true;
            }
            else
            {
                redirectForAuthToken();
            }
        }
        
        return false;
    }
    else
    {
        return true;
    }
}

let sfAccessToken = sessionStorage.getItem('sfAccessToken');
let sfAuthenticationAttempts = (sessionStorage.getItem('sfAuthCount') == null) ? 0 : sessionStorage.getItem('sfAuthCount');

let authResult = checkAuthenticationAndRetry(sfAccessToken, sfAuthenticationAttempts);

if(authResult)
{
    let newAccount = {
        "Name" : "Express Logistics and Transport"
    };

    //Execute salesforce requests
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cs9.lightning.force.com/services/data/v20.0/sobjects/Account/", true);
    xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("sfAccessToken"));
    xhr.onreadystatechange = processRequest;
    
    xhr.send(newAccount);
    
    function processRequest(e)
    {
        alert("Sent");
    }
}
else
{
    //Report auth failure
    document.write("<h4>Authentication Has Failed. Please try again.</h4>");
}*/

var jsforce = require('jsforce');
var conn = new jsforce.Connection();