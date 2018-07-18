let xhr = new XMLHttpRequest();
xhr.open("GET", "https://cs9.lightning.force.com/services/data", true);
//xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("sfAccessToken"));
xhr.onreadystatechange = processRequest;

xhr.send(null);

function processRequest(e)
{
    alert("Sent");
}