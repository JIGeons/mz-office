import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

// Actions
import * as vocaActions from "../redux/modules/VocaSlice";

// Images
import vocaImage from "../assets/images/voca/voca_img.png";

// CSS
import "../styles/vocabulary.css";

const Vocabulary = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux State
    const { vocaQuiz, vocaWord } = useSelector((state) => state.voca);

    // Component State
    const [ quiz, setQuiz ] = useState(null);
    const [ word, setWord ] = useState(null);


    useEffect(() => {
        dispatch(vocaActions.getVocaQuiz());
        dispatch(vocaActions.getVocaWord());
    }, []);

    useEffect(() => {
        if (vocaQuiz.code == "SUCCESS") {
            setQuiz(vocaQuiz.content);
        }

        if (vocaWord.code == "SUCCESS") {
            setWord(vocaWord.content);
        }
    }, [ vocaQuiz, vocaWord ])

    return (
        <div className="vocabulary">
            <div className="vocabulary_back">
                <div className="vocabulary_title">
                    <img src={vocaImage} alt="voca-image" />
                    <h1> 오피스 단어장</h1>
                </div>
                <section className="vocabulary_inner">
                    <div className="vocabulary_inner_title">
                        <h2><span>꼭 알아야할</span> 비즈니스 용어</h2>
                    </div>

                    <div className="vocabulary_inner_content voca-word">
                        <h1>{word?.word}<span>{word?.form}</span></h1>
                        <h4>{word?.explanation}</h4>
                        <p>Ex. {word?.exampleSentence}</p>
                    </div>
                </section>
                <section className="vocabulary_inner">
                    <div className="vocabulary_inner_title">
                        <h2><span>알쏭달쏭</span> 비즈니스 용어</h2>
                    </div>

                    <div className="vocabulary_inner_content voca-quiz">
                        <h3>(ex) {quiz?.exampleSentence}</h3>
                        <h1>Q. {quiz?.explanation}</h1>
                        <div className="voca-quiz-button">
                            {
                                quiz?.wrongWordList && quiz?.wrongWordList.length > 0 &&
                                quiz?.wrongWordList.map((voca, index) => {
                                    return (
                                        <button>{voca}</button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Vocabulary;