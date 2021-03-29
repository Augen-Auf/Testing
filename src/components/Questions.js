import React from 'react';

const Button = ({answer, onClick, className}) => (
    <button onClick={onClick} className={`focus:outline-none w-full p-4 font-semibold rounded shadow ${className ? 'bg-yellow-500' : 'bg-white'}`}>
        {answer}
    </button>
);

const Questions = ({handleAnswer, data: {question, answers}, curIndex, selectedAnswer}) => {
    return (
        <div>
            <div className="bg-white p-10 shadow-md">
                <h2 className="text-2xl">
                    {(curIndex + 1) + ". " + question + "?"}
                </h2>
            </div>
            <div className="mt-4 space-y-4">
                <Button className={selectedAnswer === answers[0]} onClick={() => handleAnswer(answers[0])} answer={answers[0]}/>
                <Button className={selectedAnswer === answers[1]} onClick={() => handleAnswer(answers[1])} answer={answers[1]}/>
                <Button className={selectedAnswer === answers[2]} onClick={() => handleAnswer(answers[2])} answer={answers[2]}/>
            </div>
        </div>

)};

export default Questions;