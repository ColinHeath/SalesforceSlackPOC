let http = new XMLHttpRequest();

function responseListener()
{
    alert(this.responseText);
}

http.addEventListener("load", responseListener);
http.open("GET", "https://test.salesforce.com/services/data");
http.send();