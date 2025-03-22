import React from "react";

import "../../styles/privacyPolicy.css";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-container">
            <h1>개인정보 처리방침</h1>
            <p><strong>[MZ오피스]</strong> (이하 "시닙사원")는 이용자의 개인정보를 보호하고, 관련 법령을 준수하기 위해
                다음과 같이 개인정보 처리방침을 수립하여 운영합니다.</p>
            <p>본 개인정보 처리방침은 MZ오피스가 제공하는 AI 챗봇 서비스(이하 "서비스") 이용과 관련하여 적용됩니다.</p>
            <div className="divider"></div>

            <h2>제1조 (개인정보의 수집 및 이용)</h2>
            <p>MZ오피스는 서비스 제공을 위해 아래와 같은 개인정보를 수집·이용합니다.</p>
            <table className="privacy-table">
                <thead>
                <tr>
                    <th>개인정보 항목</th>
                    <th>이용 목적</th>
                    <th>보관 기간</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>SNS 식별자</td>
                    <td>사용자 인증 및 서비스 제공, 악의적 재가입 방지</td>
                    <td>탈퇴 후 60일간 보관 후 자동 삭제</td>
                </tr>
                <tr>
                    <td>대화 내역 (질문/응답)</td>
                    <td>AI 챗봇 서비스 개선 및 품질 향상</td>
                    <td>6개월 후 자동 삭제</td>
                </tr>
                <tr>
                    <td>대화 시간</td>
                    <td>서비스 이용 패턴 분석 및 최적화</td>
                    <td>6개월 후 자동 삭제</td>
                </tr>
                <tr>
                    <td>세션 ID</td>
                    <td>대화 흐름 유지 및 보안 관리</td>
                    <td>세션 종료 후 30일 뒤 자동 삭제</td>
                </tr>
                </tbody>
            </table>
            <p> ※ MZ오피스는 최소한의 개인정보만 수집하며, 서비스 제공 목적 이외의 용도로 사용하지 않습니다.</p>

            <div className="divider"></div>

            <h2>제2조 (개인정보의 수집 방법)</h2>
            <p>MZ오피스는 아래와 같은 방법을 통해 개인정보를 수집합니다.</p>

            <div className="privacy-content">
                <p>1. <strong>SNS 로그인</strong> (네이버, 카카오, 구글 등)</p>
                <span>o 사용자가 SNS 계정으로 로그인할 때 SNS 식별자(ID)를 수집</span>
                <p>2. 자동 수집하지 않는 정보</p>
                <span>o MZ오피스는 쿠키(Cookie) 및 웹 추적 기술을 사용하지 않습니다.</span>
                <span>o 사용자의 서비스 이용 중 추가적인 개인정보를 자동으로 수집하지 않습니다.</span>
            </div>

            <div className="divider"></div>

            <h2>제3조 (개인정보의 처리 및 보유 기간)</h2>
            <div className="privacy-content">
                <p>1. MZ오피스는 이용자의 개인정보를 수집 및 이용 목적이 달성된 후 즉시 파기하는 것을 원칙으로 합니다.</p>
                <p>2. 다만, 악의적인 재가입을 방지하기 위한 운영 정책에 따라, 탈퇴한 이용자의 SNS 식별자를 60일간 보관한 후 자동 삭제합니다.</p>
                <p>3. 개인정보 보관 및 삭제 정책은 아래와 같습니다.</p>
            </div>
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
            {/*<div className="divider"></div>*/}

            {/*<h2>제4조 (개인정보의 제3자 제공)</h2>*/}
            {/*<p>1. MZ오피스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p>*/}
            {/*<ul>*/}
            {/*    <li>이용자가 사전에 동의한 경우</li>*/}
            {/*    <li>법령에 의해 제공이 요구되는 경우</li>*/}
            {/*</ul>*/}

            <div className="divider"></div>
            <h2>제5조 (개인정보의 파기 및 절차)</h2>
            <p>MZ오피스는 원칙적으로 개인정보 보유기관이 경과하거나 처리 목적이 달성된 경우 해당 정보를 즉시 파기합니다.</p>
            <div className="privacy-content">
                <p><strong>1. 파기 절차</strong></p>
                <span>o 탈퇴된 사용자의 보관기간 만료된 정보는 삭제합니다.</span>
                <p><strong>2. 파기 방법</strong></p>
                <span>o 전자적 파일 형태로 저장된 개인정보는 <strong>복구할 수 없는 기술적 방법을 사용하여 영구 삭제</strong>합니다.</span>
                <span>o 종이에 출력된 개인정보는 <strong>분쇄기로 분쇄하거나 소각하여 파기</strong>합니다.</span>
            </div>

            <div className="divider"></div>

            <h2>제6조 (개인정보 제3자 제공 여부)</h2>
            <p>MZ오피스는 이용자의 개인정보를 <strong>어떠한 경우에도 외부에 제공하지 않습니다.</strong></p>
            <p>단, 아래의 경우에는 예외적으로 제공될 수 있습니다.</p>
            <div className="privacy-content">
                <p>1. 이용자가 사전에 동의한 경우</p>
                <p>2. 법령에 따라 제공 의무가 발생하는 경우</p>
            </div>

            <div className="divider"></div>

            <h2>제7조 (개인정보 처리의 위탁 여부)</h2>
            <p>MZ오피스는 이용자의 개인정보 처리를 <strong>외부 업체에 위탁하지 않습니다.</strong></p>

            <div className="divider"></div>

            <h2>제8조 (개인정보 자동 수집 장치의 설치∙운영 및 거부에 관한사항)</h2>
            <p>1. MZ오피스는 쿠키(Cookie) 및 세션(Session)과 같은 자동 수집 장치를 사용하지 않습니다.</p>
            <p>2. 단, 서비스 최적화를 위해 세션 ID를 저장하며, 세션 종료 후 30일 뒤 자동 삭제됩니다.</p>

            <div className="divider"></div>

            <h2>제9조 (개인정보 보호책임자 및 상담·신고)</h2>
            <p>MZ오피스는 개인정보 보호를 위해 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <ul className="privacy-content">
                <li>개인정보 보호책임자</li>
                <ol className="privacy-cl">
                    <li>성명: [왕현지]</li>
                    <li>소속: [시닙사원]</li>
                    <li>연락처: [hyunjeewang@gmail.com]</li>
                </ol>
            </ul>



            <div className="divider"></div>

            <h2>제10조 (개인정보의 안전성 확보 조치)</h2>
            <p>MZ오피스는 이용자의 개인정보 보호를 위해 다음과 같은 조치를 시행하고 있습니다.</p>
            <ol className="privacy-ol">
                <li>데이터 암호화: 개인정보는 암호화된 데이터베이스(DB)에 저장됩니다.</li>
                <li>개인정보는 암호화 기술을 적용하여 보호합니다</li>
                <li>접근 권한 관리: 개인정보 접근 권한을 최소한으로 제한하며, 관리 절차를 강화합니다.</li>
                <li>보안 점검: 정기적으로 보안 점검을 수행하여 데이터 보호를 강화합니다.</li>
            </ol>

            <div className="divider"></div>

            <h2>제11조 (만 14세 미만 아동의 개인정보 처리)</h2>
            <p>MZ오피스는 만 14세 미만 아동의 개인정보를 수집하지 않습니다.</p>
            <p>아동이 서비스를 이용하려면 법정대리인의 동의가 필요하며, 동의 없는 가입은 제한됩니다.</p>

            <div className="divider"></div>

            <h2>제12조 (정보주체의 권리침해에 대한 구제방법)</h2>
            <p>이용자는 개인정보 보호 관련하여 침해를 당한 경우 아래 기관에 신고할 수 있습니다.</p>
            <ul className="privacy-ul">
                <li>개인정보침해 신고센터 (https://privacy.kisa.or.kr) / 국번 없이 118</li>
                <li>대검찰청 사이버수사과 (http://www.spo.go.kr) / 국번 없이 1301</li>
                <li>경찰청 사이버범죄 신고시스템 (https://ecrm.cyber.go.kr) / 국번 없이 182</li>
            </ul>

            <div className="divider"></div>
            <p>본 개인정보 처리방침은 [2025/03/02] 부터 적용됩니다.</p>
        </div>
    );
};

export default PrivacyPolicy;
