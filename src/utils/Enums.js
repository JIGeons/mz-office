const GenerateType = (type) => {
    let messageType = type;

    switch (type) {
        case "CONGRATULATION":
            messageType = "경사";
            break;
        case "INQUIRY":
            messageType = "조사";
            break;
        case "APPRECIATION":
            messageType = "감사";
            break;
        case "APOLOGY":
            messageType = "사과";
            break;
        case "SCHEDULE_CONFIRMATION":
            messageType = "일정 확인";
            break;
        case "ANNOUNCEMENT":
            messageType = "공지";
            break;
        case "WORK_REQUEST":
            messageType = "업무 요청";
            break;
        case "FOLLOW_UP":
            messageType = "팔로우업";
            break;
        case "FEEDBACK_REQUEST":
            messageType = "피드백 요청";
            break;
        case "REMINDER":
            messageType = "리마인드";
            break;
        case "THANK_YOU":
            messageType = "감사";
            break;
        case "GREETING":
            messageType = "인사";
            break;
        case "SUGGESTION":
            messageType = "제안";
            break;
        default:
            break;
    }

    console.log("messageType : ", messageType, "");
    return messageType;
}

const RequestType = (type) => {
    let requestType = type;

    switch (type) {
        case "EMAIL":
            requestType = "메일";
            break;
        case "MESSAGE":
            requestType = "문자";
            break;
        default:
            break;
    }

    return requestType;
}

export { GenerateType, RequestType };