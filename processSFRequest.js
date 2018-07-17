let xhr = new XMLHttpRequest();
xhr.open("GET", "https://ipinfo.io/json", true);
xhr.send();

xhr.onreadystatechange = processRequest;

function processRequest(e)
{
    if(xhr.readyState == 4 && xhr.status == 200)
    {
        let response = JSON.parse(xhr.responseText);
        alert(response.ip);
        alert(xhr.responseText);
    }
}