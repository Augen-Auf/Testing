import React,  {useState, useEffect} from 'react';
import {
    DataGrid,
    Column
} from 'devextreme-react/data-grid';
import { Chart, Series, CommonSeriesSettings} from 'devextreme-react/chart';

const API_URL = "https://localhost:44342/api/Responses";



const Results = ({questions, results, user}) => {
    const [resultData, setResultData] = useState([]);
    const [score, setScore] = useState(0);
    const [userResults, setUserResults] = useState([]);
    const [statistics, setStatistics] = useState([]);

    useEffect(() => {
        const resObj = Object.entries(results).map((result) => {
            return {
                'QuestionNumber': (1 + parseInt(result[0])),
                'QuestionId': questions[result[0]].id,
                'Question': questions[result[0]].question,
                'UserAnswer': result[1],
                'RightAnswer': questions[result[0]].correct_answer
            }
        });

        const answers = resObj.map((el) => el.UserAnswer).join(',');

        const correct_questions = resObj
            .filter(el => el.UserAnswer === el.RightAnswer)
            .map(el => el.QuestionId).join(',');

        const incorrect_questions = resObj
            .filter(el=> el.UserAnswer !== el.RightAnswer)
            .map(el => el.QuestionId).join(',');

        setScore(correct_questions.split(',').length);

        let userResponse = {
            'user_id': user.id,
            answers,
            correct_questions,
            incorrect_questions
        };

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userResponse)
        }).then(() => {
            setResultData(resObj);
            fetch(API_URL)
                .then((res) => res.json())
                .then((data) => {
                    const results = data.map((record) => ({
                        ...record,
                        correct_questions: record.correct_questions ?
                            record.correct_questions.split(',')
                                .map(el => parseInt(el)) : [],
                        incorrect_questions: record.incorrect_questions ?
                            record.incorrect_questions.split(',')
                                .map(el => parseInt(el)) : []
                    }));

                    setUserResults(results);
                });
        });

    }, [questions, results, user]);

    useEffect(() => {
        let resStat = questions.map(el => {
            return {
                'questionNumber': el.id,
                'correct': 0,
                'incorrect': 0
            }
        });

        userResults.forEach(result => {
            for (let q of result.correct_questions)
            {
                let element = resStat.find(el => el.questionNumber === q);
                element.correct += 1
            }
            for (let q of result.incorrect_questions)
            {
                let element = resStat.find(el => el.questionNumber === q);
                element.incorrect += 1
            }
        });

        setStatistics(resStat)
    }, [userResults,questions]);

    return (
        (resultData.length > 0 ?
            (
                <div className="lg:w-7/12 sm:w-11/12 mx-auto mt-4 mb-4 p-10 bg-white rounded">
                    <h3 className="w-full text-center">Результаты:</h3>
                    <DataGrid className="mt-4 w-11/12 mx-auto border-2" id="dataGrid" dataSource={resultData}>
                        <Column cssClass="w-1/12" dataField="QuestionNumber" caption="№"/>
                        <Column cssClass="w-5/12" dataField="Question" caption="Вопрос"/>
                        <Column dataField="UserAnswer" caption="Ответ пользователя"/>
                        <Column dataField="RightAnswer" caption="Правильный ответ"/>
                    </DataGrid>
                    <h3 className="w-full text-center mt-4">Правильных ответов: {score} / {questions.length} </h3>
                    <div>
                        <h3 className="w-full text-center mt-4">Количество тестируемых : {userResults.length} </h3>
                        <DataGrid className="mt-4 w-11/12 mx-auto border-2" id="dataGrid" dataSource={statistics}>
                            <Column cssClass="w-1/12" dataField="questionNumber" caption="№"/>
                            <Column cssClass="w-5/12" dataField="correct" caption="Правильно"/>
                            <Column dataField="incorrect" caption="Не правильно"/>
                        </DataGrid>

                        <Chart
                            id="chart"
                            title="Статистика по результатам тестирования"
                            className="w-11/12 mx-auto mt-4"
                            dataSource={statistics} >
                            <CommonSeriesSettings argumentField="questionNumber" type="stackedBar" />
                            <Series
                                valueField="correct"
                                name="Правильно"
                                stack="male"
                            />
                            <Series
                                valueField="incorrect"
                                name="Не правильно"
                                stack="male"
                            />
                        </Chart>
                    </div>
                </div>
            )
            : (
                <div className="h-screen flex items-center">
                    <h3 className="text-2xl font-bold w-full text-center">Loading...</h3>
                </div>)
        )
    );
};

export default Results;