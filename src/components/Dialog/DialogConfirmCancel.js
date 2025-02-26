import React from 'react';

// CSS
import "../../styles/components/dialog.css"

const DialogConfirmCancel = ({ title, content, onClickPositiveBtn, onClickNegativeBtn, positiveBtnContent, negativeBtnContent }) => {
    return (
        <modal className="dialog-modal">
            <div className="dialog_inner">
                <div className="dialog_title">{title}</div>
                <div className="dialog_content">{content}</div>
                <div className="dialog_btn_group">
                    <button className="dialog_btn dialog_btn_negative" onClick={onClickNegativeBtn}>{negativeBtnContent}</button>
                    <button className="dialog_btn dialog_btn_positive" onClick={onClickPositiveBtn}>{positiveBtnContent}</button>
                </div>
            </div>
        </modal>
    )
}

export default DialogConfirmCancel;