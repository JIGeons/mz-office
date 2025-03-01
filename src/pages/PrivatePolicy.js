import React from "react";

const PrivacyPolicy = () => {
    return (
        <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", margin: "20px", padding: "20px" }}>
            <h1>개인정보 처리방침</h1>
            <p><strong>[MZ오피스]</strong> (이하 "시닙사원")는 이용자의 개인정보를 보호하고, 관련 법령을 준수하기 위해 개인정보 처리방침을 수립하여 운영합니다.</p>
            <p>본 개인정보 처리방침은 MZ오피스가 제공하는 AI 챗봇 서비스(이하 "서비스") 이용과 관련하여 적용됩니다.</p>

            <h2>제1조 (개인정보의 수집 및 이용)</h2>
            <p>MZ오피스는 서비스 제공을 위해 아래와 같은 개인정보를 수집·이용합니다.</p>
            <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0", border: "1px solid #ddd" }}>
                <thead>
                <tr style={{ background: "#f4f4f4" }}>
                    <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>개인정보 항목</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>이용 목적</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>보관 기간</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>SNS 식별자</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>사용자 인증 및 서비스 제공, 악의적 재가입 방지</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>탈퇴 후 60일간 보관 후 자동 삭제</td>
                </tr>
                <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>대화 내역 (질문/응답)</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>AI 챗봇 서비스 개선 및 품질 향상</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>6개월 후 자동 삭제</td>
                </tr>
                <tr>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>대화 시간, 세션 ID</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>서비스 이용 패턴 분석 및 최적화</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>6개월 후 자동 삭제</td>
                </tr>
                </tbody>
            </table>
            <p>※ MZ오피스는 최소한의 개인정보만 수집하며, 서비스 제공 목적 이외의 용도로 사용하지 않습니다.</p>

            <h2>제2조 (개인정보의 수집 방법)</h2>
            <ul>
                <li><strong>SNS 로그인</strong> (네이버, 카카오, 구글 등) - 사용자가 SNS 계정으로 로그인할 때 SNS 식별자(ID)를 수집</li>
                <li>자동 수집하지 않는 정보 - MZ오피스는 쿠키(Cookie) 및 웹 추적 기술을 사용하지 않습니다.</li>
            </ul>

            <h2>제3조 (개인정보의 처리 및 보유 기간)</h2>
            <p>1. MZ오피스는 이용자의 개인정보를 수집 및 이용 목적이 달성된 후 즉시 파기하는 것을 원칙으로 합니다.</p>
            <p>2. 다만, 악의적인 재가입을 방지하기 위한 운영 정책에 따라, 탈퇴한 이용자의 SNS 식별자를 60일간 보관한 후 자동 삭제합니다.</p>
        </div>
    );
};

export default PrivacyPolicy;
