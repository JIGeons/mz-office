let ServerUrl = "";
let SocketUrl = "";

if (window.location.href.includes("mz-office.site")) {
    ServerUrl = "http://server.mz-office.site";
    SocketUrl = "ws://server.mz-office.site/ws/chat-connect";
} else if (window.location.href.includes("mz-office.s3-website.kr.object.ncloudstorage.com/")) {
    ServerUrl = "http://223.130.133.149:8080";
    SocketUrl = "ws://223.130.133.149:8080/ws/chat-connect";
} else if (window.location.href.includes("localhost")){
    ServerUrl = "http://223.130.133.149:8080";
    SocketUrl = "ws://223.130.133.149:8080/ws/chat-connect";
} else {
    ServerUrl = "http://223.130.133.149:8080";
    SocketUrl = "ws://223.130.133.149:8080/ws/chat-connect";
}

export default ServerUrl;
export { SocketUrl };