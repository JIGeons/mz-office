import React, {useState} from "react";

// CSS
import "../styles/components/accountDelete.css";

const AccountDelete = () => {
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleSubmit = () => {
        console.log("ㅊㅔ크박스 확인: ", isChecked);
    }

    return (
        <div className="account-delete">
            <modal className="account-delete-modal">
                <h1>회원 탈퇴</h1>
                <div className="divider"></div>
                <section className="account-delete-description">
                    <ul>
                        <h2>1. 탈퇴 후 복구나 불가 안내</h2>
                        <li><span>ㆍ</span> 회원 탈퇴 후에는 계정을 복구할 수 없습니다. 탈퇴 전에 필요한 데이터가 있는 경우 백업을 권장합니다.</li>

                        <h2>2. 탈퇴 후 데이터 처리 안내</h2>
                        <li><span>ㆍ</span>탈퇴 즉시 서비스 이용이 불가능하며, 회원님의 SNS 개인 식별자(UUID)는 60일 동안 보관된 후 삭제됩니다.</li>
                        <li><span>ㆍ</span>사용자 입력 데이터 대화 로그는 6개월간 보관됩니다. (보관 사유: 부정 이용 방지 및 신고 대응)</li>
                        <li><span>ㆍ</span>탈퇴 후 동일한 네이버 계정으로 재가입하더라도 새로운 UUID가 부여되며 기존 데이터는 복구되지 않습니다.</li>

                        <h2>3. 재가입 제한 안내</h2>
                        <li><span>ㆍ</span>회원 탈퇴 후 60일 동안 동일 네이버 계정으로 재가입이 제한됩니다.</li>
                    </ul>
                </section>
                <div className="divider"></div>
                <div className="account-delete-check">
                    <input type="checkbox" checked={isChecked} onChange={handleChange} />
                    <h7>유의사항을 확인하였으며, 탈퇴에 동의합니다.</h7>
                </div>
                <button className={isChecked ? "clickable" : ""}
                        disabled={!isChecked}
                        onClick={() => { handleSubmit() }}
                >
                    확인
                </button>
            </modal>
        </div>
    )
}

export default AccountDelete;