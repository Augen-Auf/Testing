import React, {useState} from 'react';

const Users = ({getUser}) => {
    const [user, setUser] = useState("");
    const changeHandler = (event) => {
        setUser(event.target.value)
    };
    return (
        <div className="h-screen flex items-center">
            <div>
            <div className="bg-white p-4 shadow-md">
                <h2 className="text-2xl">
                    Введите Ф.И.О тестируемого
                </h2>
            </div>
            <div className="mt-4 space-y-4">
                <input autoFocus className="focus:outline-none w-full p-2 rounded" required onChange={changeHandler} type="text"/>
            </div>
            <div className="w-full text-center">
                <button className="focus:outline-none mt-4 w-full p-3 font-semibold rounded shadow bg-white"
                        onClick={() => getUser(user)}> Пройти тестирование</button>
            </div>
            </div>
        </div>
    )};
export default Users;