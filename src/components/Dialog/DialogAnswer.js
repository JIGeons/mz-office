import React from 'react';

// Images
import rightIcon from "../../assets/images/voca/img_correct.png";
import wrongIcon from "../../assets/images/voca/img_incorrect.png";

// CSS
import "../../styles/components/dialog.css"

const DialogAnswer = ({ content }) => {
    return (
        <modal className="dialog-modal">
            <div className="dialog_inner">
                {   content == "right" ?
                    <div>
                        <img className="dialog_icon" src={ rightIcon } alt="rightIcon.png" />
                        <h3>정답입니다!</h3>
                    </div>
                    :   <div>
                            <img className="dialog_icon" src={ wrongIcon } alt="rightIcon.png" />
                            <h3>오답입니다.</h3>
                            <h3>다시 선택해 주세요!</h3>
                        </div>
                }
                <button>
                    확인
                </button>
            </div>
        </modal>
    );
}

export default DialogAnswer;