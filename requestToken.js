let sfAccessToken = sessionStorage.getItem('sfAccessToken');

if(sfAccessToken == null || sfAccessToken == '')
{
    let urlHash = window.location.hash.substr(1);
    let hashParamObject = urlHash.split('&').reduce((result, item) => {
        let keyValuePair = item.split('=');
        result[keyValuePair[0]] = keyValuePair[1];
        return result;
    }, {});
    
    if(hashParamObject['access_token'] != null && hashParamObject['access_token'] != '')
    {
        sessionStorage.setItem('sfAccessToken', hashParamObject['access_token']);
    }
    else
    {
        window.location.replace('https://localhost:8080/index.html');
    }
}

window.location.hash = "";