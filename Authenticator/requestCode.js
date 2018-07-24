let currentURL = window.location.href;

let protocol = "https://"
let redirectURL = "test.salesforce.com/services/oauth2/authorize";
let paramObject = {
    response_type: "token",
    client_id: "3MVG9FS3IyroMOh6n9lxAQusceSBzSXmXtR5WRAAlk7clyvBs2cYAmxlFiDwj38Nf2aQMG8Ieft5kH9t.T_RR",
    redirect_uri: "https://localhost:8080/token.html"
}

redirectURL += "?response_type=" + paramObject.response_type;
redirectURL += "&client_id=" + paramObject.client_id;
redirectURL += "&redirect_uri=" + paramObject.redirect_uri;
redirectURL = (protocol) + (redirectURL);

window.location.replace(redirectURL);