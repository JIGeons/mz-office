let ServerUrl = "";
let SocketUrl = "";

if (window.location.href.includes("mz-office.com")) {
    ServerUrl = "https://mz-office.com:8080";
    SocketUrl = "ws://mz-office.com:8080";
} else if (window.location.href.includes("http://mz-office.s3-website.kr.object.ncloudstorage.com/")) {
    ServerUrl = "http://223.130.133.149:8080";
    SocketUrl = "ws://223.130.133.149:8080/api/v1/chat/connect";
} else if (window.location.href.includes("localhost")){
    // ServerUrl = "http://223.130.133.149:8080";
    SocketUrl = "ws://223.130.133.149:8080/ws/chat-connect";

    ServerUrl = "http://223.130.133.149:8080";
    // SocketUrl = "ws://172.30.1.23:8080/ws/chat-connect";
}

export default ServerUrl;
export { SocketUrl };