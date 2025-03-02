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

    // console.log("messageType : ", messageType, "");
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
            requestType = null;
            break;
    }

    return requestType;
}

const Day = (day) => {
    switch (day) {
        case 0:
            return "일요일";
        case 1:
            return "월요일";
        case 2:
            return "화요일";
        case 3:
            return "수요일";
        case 4:
            return "목요일";
        case 5:
            return "금요일";
        case 6:
            return "토요일";
        default:
            return null;
    }
}

export { GenerateType, RequestType, Day };