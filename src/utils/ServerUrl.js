let ServerUrl = "";

if (window.location.href.includes("mz-office.com")) {
    ServerUrl = "https://mz-office.com:8080";
} else  {
    ServerUrl = "http://223.130.133.149:8080";
}

export default ServerUrl;