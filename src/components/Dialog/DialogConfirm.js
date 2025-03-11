import React from 'react';

// CSS
import "../../styles/components/dialog.css"

// Utils
import { getIsMobile } from "../../utils/Utils";

const DialogConfirm = ({ title, content, onClickPositiveBtn, positiveBtnContent }) => {
    const userAgent = navigator.userAgent;
    const isMobile = getIsMobile(userAgent);

    return (
        <modal className={isMobile ? "mobile-dialog-modal" : "dialog-modal"}>
            <div className={isMobile ? "mobile-dialog_inner" : "dialog_inner"}>
                <div className={isMobile ? "mobile-dialog_title" : "dialog_title"}>{title}</div>
                <div className={isMobile ? "mobile-dialog_content" : "dialog_content"}>{content}</div>
                <div className={isMobile ? "mobile-dialog_btn_group" : "dialog_btn_group"}>
                    <button className={isMobile ? "mobile-dialog_btn mobile-dialog_btn_confirm" : "dialog_btn dialog_btn_confirm"} onClick={onClickPositiveBtn}>{positiveBtnContent}</button>
                </div>
            </div>
        </modal>
    )
}

export default DialogConfirm;