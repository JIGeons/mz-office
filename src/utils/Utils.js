import { Day } from "./Enums";

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${date}`;
}

function getTodayDateToString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");

    return `${year}년 ${month}월 ${date}일 ${Day(today.getDay())}`;
}

function transferDateToString(date) {
    const dateToString = new Date(date);
    const year = dateToString.getFullYear();
    const month = String(dateToString.getMonth() + 1).padStart(2, "0");
    const day = String(dateToString.getDate()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${Day(dateToString.getDay())}`;
}

export {
    getTodayDate,
    getTodayDateToString,
    transferDateToString
};