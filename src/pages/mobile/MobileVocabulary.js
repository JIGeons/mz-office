import React, {useState, useEffect, useRef, useReducer} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

// Actions
import * as vocaActions from "../../redux/modules/VocaSlice";
import * as constantActions from "../../redux/modules/ConstantSlice";

// Images
import backIcon from "../../assets/images/voca/ico-bag.png";
import correctImg from "../../assets/images/voca/img_correct.png";
import incorrectImg from "../../assets/images/voca/img_incorrect.png";
import correctImgx2 from "../../assets/images/voca/img_correct@x2.png";
import correctImgx3 from "../../assets/images/voca/img_correct@x3.png";
import incorrectImgx2 from "../../assets/images/voca/img_incorrect@x2.png";
import incorrectImgx3 from "../../assets/images/voca/img_incorrect@x3.png";

// CSS
import "../../styles/vocabulary.css";
import  "@fontsource/titan-one";

const MobileVocabulary = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux State
    const { vocaQuiz, vocaWord } = useSelector((state) => state.voca);

    // Component State
    const [ quiz, setQuiz ] = useState(null);
    const [ word, setWord ] = useState(null);
    // const [ quizSentence, setQuizSentence ] = useState(null);
    // const [ answerButton, setAnswerButton ] = useState([]);
    const [ onShowAnswer, setOnShowAnswer ] = useState(false);
    const [ _, forceUpdate ] = useReducer(x => x + 1, 0);

    // useRef
    const selectedAnswerRef = useRef(null);
    const showModalRef = useRef(false);


    useEffect(() => {
        dispatch(vocaActions.getVocaQuiz());
        dispatch(vocaActions.getVocaWord());
    }, []);

    useEffect(() => {
        if (vocaQuiz?.code == "SUCCESS") {
            setQuiz(vocaQuiz.content);

            const quiz = {...vocaQuiz.content };
            console.log("@@@@ ", quiz);

            // 정답 버튼 생성
            const wrongWordList = quiz.wrongWordList;
            // 랜덤한 인덱스 생성 (0부터 wrongWordList.length 사이)
            quiz.answerIndex = Math.floor(Math.random() * (wrongWordList.length + 1));

            // 새로운 배열을 생성하여 삽입
            quiz.wrongWordList = [
                ...wrongWordList.slice(0, quiz.answerIndex),  // 앞쪽 배열 유지
                vocaQuiz.content.word,                         // 랜덤한 위치에 새로운 객체 추가
                ...wrongWordList.slice(quiz.answerIndex)      // 뒷쪽 배열 유지
            ];

            // 단어 길이만큼 'ㅇ' 생성
            const clearWord = "ㅇ".repeat(quiz.word.length);

            // 정규식을 사용하여 모든 해당 단어를 대체
            quiz.explanation = vocaQuiz.content.explanation.replace(new RegExp(quiz.word, "g"), clearWord);
            quiz.exampleSentence = vocaQuiz.content.exampleSentence.replace(new RegExp(quiz.word, "g"), clearWord);

            setQuiz(quiz);
        }

        if (vocaWord?.code == "SUCCESS") {
            setWord(vocaWord.content);
        }
    }, [ vocaQuiz, vocaWord ])

    // 정답을 확인하고 Dialog를 띄우는 메서드
    const handleAnswerCheck = (index) => {
        console.log("정답 버튼 클릭!");
        selectedAnswerRef.current = index;
        showModalRef.current = true;
        // setOnShowAnswer(true);

        forceUpdate();    // 강제 렌더링
    }

    const handleConfirmButton = () => {
        // 정답을 맞추면 새로운 퀴즈 요청
        if (selectedAnswerRef.current == quiz.answerIndex) {
            selectedAnswerRef.current = null;
            dispatch(vocaActions.getVocaQuiz());
            console.log("정답입니다!");
        }
        console.log("정답 확인 dialog OFF");
        // setOnShowAnswer(false);
        showModalRef.current = false;
        forceUpdate();    // 강제 렌더링
    }

    return (
        <div className="mobile-vocabulary">
            <div className="mobile_vocabulary_back">
                <section className="mobile_vocabulary_inner">
                    <div className="mobile_vocabulary_inner_content mobile-voca-word">
                        <h1>{word?.word}<span>{word?.form}</span></h1>
                        <h4>{word?.explanation}</h4>
                        <p>Ex. {word?.exampleSentence}</p>
                    </div>
                </section>
                <section className="mobile_vocabulary_inner">
                    <div className="mobile_vocabulary_inner_title">
                        <img src={backIcon} alt="bag.png" />
                        <h2><span>알쏭달쏭</span> 비즈니스 용어</h2>
                    </div>

                    <div className="mobile_vocabulary_inner_content mobile-voca-quiz">
                        <h2><span>Q.</span> {quiz?.explanation}</h2>
                        <h3>(ex) {quiz?.exampleSentence}</h3>
                        <div className="mobile-voca-quiz-button">
                            {
                                quiz && quiz.wrongWordList &&
                                quiz.wrongWordList.map((voca, index) => {
                                    return (
                                        <button
                                            className={( index == selectedAnswerRef.current) ? ( (index == quiz.answerIndex) ? "answer-selected" : "selected" ) : ""}
                                            onClick={() => { handleAnswerCheck(index) }}
                                        >
                                            {voca}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </section>
            </div>

            {/* 정답 확인 모달 */}
            {   showModalRef.current &&
                <section className="mobile-dialog-modal">
                    <div className="mobile-dialog_inner">
                        {   quiz.answerIndex == selectedAnswerRef.current ?
                            <div className="mobile-dialog_content">
                                <img
                                    className="mobile-dialog_icon"
                                    src={ correctImg }
                                    srcSet={`${correctImgx2} 2x, ${correctImgx3} 3x`}
                                    alt="rightIcon.png" />
                                <div className="mobile-dialog-answer-content">
                                    <h3><span className="correct-answer">정답</span> 입니다!</h3>
                                </div>
                            </div>
                            : <div className="mobile-dialog_content">
                                <img
                                    className="mobile-dialog_icon"
                                    src={ incorrectImg }
                                    srcSet={`${incorrectImgx2} 2x, ${incorrectImgx3} 3x`}
                                    alt="rightIcon.png" />
                                <div className="mobile-dialog-answer-content">
                                    <h3><span className="incorrect-answer">오답</span> 입니다.</h3>
                                    <h4>다시 선택해 주세요!</h4>
                                </div>
                            </div>
                        }
                        <button
                            className="mobile-dialog_answer_button"
                            onClick={() => handleConfirmButton()}>
                            확인
                        </button>
                    </div>
                </section>
            }
        </div>
    );
}

export default MobileVocabulary;