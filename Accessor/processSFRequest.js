alert(sessionStorage.getItem('sfAccessToken'));

let xhr = new XMLHttpRequest();
xhr.open("POST", "https://cs9.lightning.force.com/services/data/v20.0/sobjects/Account/", true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("sfAccessToken"));
xhr.onreadystatechange = processRequest;

let newAccount = {
    "Name" : "Express Logistics and Transport"
};

xhr.send(newAccount);

function processRequest(e)
{
    alert("Sent");
}