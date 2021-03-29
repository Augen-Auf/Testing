import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React, {useState, useEffect} from 'react';
import {Questions, Results, Users} from './components'

const API_URL = "https://localhost:44342/";

function App() {
  const [questions, setQuestions] = useState([]);
  const [curIndex, setCurIndex] = useState(0);
  const [userAnswers, setUserAnswer] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(undefined);
  const [testEnded, setTestEnded] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch(API_URL + 'api/Questions')
        .then((res) => res.json())
        .then((data) => {
            const questions = data.map((question) => ({
                ...question,
                answers: [question.correct_answer, question.incorrect_answer1,
                    question.incorrect_answer2].sort(() => Math.random() - 0.5)
            }));

            setQuestions(questions)
        });
  }, []);

  const handleAnswer = (answer) => {
      let updateAnswer = userAnswers;
      updateAnswer[curIndex] = answer;
      setUserAnswer(updateAnswer);
      setSelectedAnswer(answer);
  };

  const endTest = () => {
      setTestEnded(true)
  };

  const changeQuestion = (changeValue) => {
      const newCurIndex =  (questions.length + (curIndex + changeValue)) % questions.length;
      setCurIndex(newCurIndex);
      setSelectedAnswer(userAnswers[newCurIndex])
  };
  const getUser = (user) => {
      console.log(user);
      fetch(API_URL + 'api/Users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({'fullName': user})
      })
          .then(response => response.json())
          .then(data => {
              setUser({'id':data.id, 'fullName': data.fullName})
          })
  };
  return testEnded ? (
      <div className="container">
      <Results questions={questions} results={userAnswers} user={user}/>
      </div>
      ):(Object.keys(user).length === 0 ? (
      <Users getUser={getUser}/>
  ) :(questions.length > 0 ? (
        <div className="h-screen flex items-center justify-center">
            <div>
            <Questions data={questions[curIndex]} curIndex={curIndex}
                       selectedAnswer={selectedAnswer} handleAnswer={handleAnswer}/>
            <div className="mt-4 flex justify-between">
                <button onClick={() => changeQuestion(-1)} className="bg-white w-3/12 p-4 font-semibold
                rounded shadow focus:outline-none"> Назад </button>

                {Object.keys(userAnswers).length === questions.length ? <button className="bg-white w-5/12 p-4 font-semibold
                rounded shadow focus:outline-none" onClick={() => endTest()}> Завершить тест </button> : null}

                <button onClick={() => changeQuestion(1)} className="bg-white w-3/12 p-4 font-semibold
                rounded shadow focus:outline-none"> Вперед </button>
            </div>
            </div>
        </div>
      ) : (<h1 className="text-2xl font-bold">Loading...</h1>)
  ));
}

export default App;
