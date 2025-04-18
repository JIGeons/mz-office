import React from 'react';

import "../../styles/privacyPolicy.css";

const TermsAndConditions = () => {
    return (
        <div className="privacy-policy-container">
            <h1>이용약관</h1>
            <p>본 이용약관(이하 "약관")은 시닙사원이 제공하는 AI 챗봇 서비스(이하 "MZ오피스")의 이용과 관련하여, 회사와 이용자 간의 권리와 의무 및 기타 사항을 규정함을 목적으로 합니다.</p>
            <p>서비스 이용 전에 반드시 본 약관을 읽어보시고, 동의 후 이용해 주시기 바랍니다.</p>

            <div className={"divider"}></div>

            <h2>제1조 (목적)</h2>
            <p>본 약관은 회사가 운영하는 AI 챗봇 서비스 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.</p>
            <div className={"divider"}></div>

            <h2>제2조 (정의)</h2>
            <ol>
                <li>"MZ오피스"란 회사가 제공하는 AI 챗봇을 통해 사용자의 질문에 답변을 제공하는 기능을 의미합니다.</li>
                <li>"이용자"란 본 약관에 동의하고 서비스를 이용하는 개인을 말합니다.</li>
                <li>"SNS 식별자"란 사용자의 계정을 식별하기 위해 소셜 로그인(네이버, 카카오, 구글 등)에서 제공하는 고유 ID를 의미합니다.</li>
                <li>"대화 내역이란 사용자가 챗봇과 주고받은 질문 및 답변을 의미합니다.</li>
                <li>"세션 ID"란 특정 대화의 연속성을 유지하기 위해 부여된 고유한 식별값을 의미합니다.</li>
            </ol>
            <p></p>
            <div className={"divider"}></div>

            <h2>제3조 (서비스 이용 및 제한)</h2>
            <ol>
                <li>이용자는 본 약관에 동의한 후 서비스를 사용할 수 있습니다.</li>
                <li>서비스는 로그인 후 이용 가능하며, SNS 식별자를 기반으로 사용자의 대화 내역을 관리합니다.</li>
                <li>사용자는 법령을 위반하거나, 비정상적인 방법으로 서비스를 이용해서는 안 됩니다.</li>
                <li>회사는 서비스 운영 및 개선을 위해 필요할 경우, 서비스 제공을 일시적으로 중단하거나 변경할 수 있습니다.</li>
            </ol>
            <div className={"divider"}></div>

            <h2>제4조 (개인정보 보호 및 데이터 저장 정책)</h2>
            <ol>
                <li>회사는 서비스 제공을 위해 SNS 식별자, 대화 내역, 대화 시간, 세션 ID를 수집·이용합니다.</li>
                <li>개인정보 처리에 대한 사항은 개인정보 처리방침을 따릅니다.</li>
                <li>데이터 보관 및 삭제 정책은 아래와 같습니다.</li>
                <table className="privacy-table">
                    <thead>
                    <tr>
                        <th>개인정보 항목</th>
                        <th>보관 기간</th>
                        <th>삭제 시점</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>SNS 식별자</td>
                        <td>탈퇴 후 60일</td>
                        <td>60일 후 자동 삭제</td>
                    </tr>
                    <tr>
                        <td>대화 내역 (질문/응답)</td>
                        <td>6개월</td>
                        <td>6개월 후 자동 삭제</td>
                    </tr>
                    <tr>
                        <td>대화 시간</td>
                        <td>6개월</td>
                        <td>6개월 후 자동 삭제</td>
                    </tr>
                    <tr>
                        <td>세션 ID</td>
                        <td>30일</td>
                        <td>세션 종료 후 30일 뒤 자동 삭제</td>
                    </tr>
                    </tbody>
                </table>
                <li>SNS 식별자는 탈퇴 후 60일간 보관되며, 이는 악의적 재가입 방지를 위한 운영 정책에 따른 것입니다.</li>
                <li>이용자는 서비스 내 "개인정보 관리" 기능을 통해 자신의 데이터를 확인 및 삭제할 수 있습니다.</li>
            </ol>
            <div className={"divider"}></div>

            <h2>제5조 (이용자의 의무)</h2>
            <p>이용자는 서비스를 이용함에 있어 다음 사항을 준수해야 합니다.</p>
            <ol>
                <li>서비스 이용 시 타인의 개인정보를 입력하거나 도용하지 않습니다.</li>
                <li>챗봇과의 대화에서 불법적이거나 부적절한 콘텐츠를 입력하지 않습니다.</li>
                <li>자동화된 프로그램(매크로 등)을 사용하여 챗봇을 악용하지 않습니다.</li>
                <li>서비스의 정상적인 운영을 방해하는 행위를 하지 않습니다.</li>
            </ol>
            <div className={"divider"}></div>

            <h2>제6조 (회사의 의무)</h2>
            <ol>
                <li>회사는 서비스 제공과 관련하여 이용자의 개인정보를 보호하며, 이용자의 동의 없이 제3자에게 제공하지 않습니다.</li>
                <li>회사는 서비스의 안정적인 운영을 위해 지속적으로 노력하며, 보안 강화를 위한 조치를 시행합니다.</li>
                <li>회사 는 이용자의 불만사항이 접수된 경우, 이를 신속하게 해결하기 위해 노력합니다.</li>
            </ol>
            <div className={"divider"}></div>

            <h2>제7조 (탈퇴 및 재가입 제한 정책)</h2>
            <ol>
                <li>이용자는 언제든지 서비스 탈퇴를 신청할 수 있으며, 탈퇴 즉시 SNS 식별자가 삭제됩니다.</li>
                <li>단, 악의적 재가입을 방지하기 위해 탈퇴 후 60일 동안 SNS 식별자를 보관하며, 60일이 지나면 자동 삭제됩니다.</li>
                <li>재가입을 원할 경우, 탈퇴 후 60일이 지난 후에만 신규 가입이 가능합니다.</li>
            </ol>
            <div className={"divider"}></div>

            <h2>제8조 (서비스 제공의 중단 및 종료)</h2>
            <ol>
                <li>회사는 다음과 같은 경우에 서비스 제공을 중단할 수 있습니다.</li>
                <ul>
                    <li>서비스 유지보수를 위한 점검이 필요한 경우</li>
                    <li>천재지변, 정전, 시스템 오류 등으로 인해 서비스 제공이 불가능한 경우</li>
                    <li>회사의 운영 정책에 따라 서비스 종료가 결정된 경우</li>
                </ul>
                <li>회사는 서비스 종료 시 사전에 공지하고, 보유한 데이터를 삭제할 수 있도록 이용자에게 안내합니다.</li>
            </ol>
            <div className={"divider"}></div>

            <h2>제9조 (면책 조항)</h2>
            <ol>
                <li>회사는 서비스의 정확성, 완전성, 신뢰성에 대해 보증하지 않습니다.</li>
                <li>이용자가 챗봇의 응답을 참고하여 내린 결정에 대한 법적 책임은 이용자에게 있습니다.</li>
                <li>회사는 이용자의 과실로 인해 발생한 개인정보 유출에 대해 책임을 지지 않습니다.</li>
            </ol>
            <div className={"divider"}></div>

            <h2>제10조 (이용 약관의 변경)</h2>
            <ol>
                <li>회사는 관련 법령을 준수하는 범위 내에서 본 약관을 개정할 수 있습니다.</li>
                <li>약관이 변경될 경우, 회사는 변경 사항을 사전에 공지하며, 변경된 약관은 공지일로부터 7일 후 효력이 발생합니다.</li>
                <li>이용자가 변경된 약관에 동의하지 않을 경우, 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
            </ol>

            <div className={"divider"}></div>

            <h2>제11조 (문의 및 연락처)</h2>
            <p>서비스 이용과 관련한 문의 사항은 아래로 연락해 주세요.</p>
            <ul>
                <li>담당 부서: [시닙사원팀]</li>
                <li>이메일: [hyunjeewang@gmail.com]</li>
                <li>전화번호: [010-9644-5498]</li>
            </ul>
            <div className={"divider"}></div>

            <h2>부칙</h2>
            <p>본 이용약관은 [2025/03/02]부터 적용됩니다.</p>
        </div>
    );
}

export default TermsAndConditions;