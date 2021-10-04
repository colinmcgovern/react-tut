import './App.css';
import React, {useEffect, useState, useRef} from "react";
import {useForm} from "./useForm"
import {Hello} from './Hello'
import {useFetch} from './useFetch'

const App = () => {

  const [values,handleChange] = useForm({
    email: "",
    password: "",
    firstName: ""
  });

  const [count, setCount] = useState(() =>
    JSON.parse(localStorage.getItem('count'))
  );
  const {data, loading} = useFetch("http://numbersapi.com/${count}/trivia");
  const inputRef = useRef();

  useEffect(() => {
    localStorage.setItem("count", JSON.stringify(count));
  }, [count]);

  return (
    <div>
        <div>{loading ? "loading...":data}</div>
        <div>count: {count}</div>
        <button onClick={()=>setCount(c=>c+1)}>increment</button>

        <>

        {/* <button onClick={() => setShowHello(!showHello)}>Toggle</button> */}
        {/* showHello && <Hello/> */}

        <input
          name='email'
          value={values.email}
          onChange={handleChange}
        />

        <input
          name='firstName'
          placeholder="first name"
          value={values.firstName}
          onChange={handleChange}
        />

        <input
          name='password'
          type='password'
          value={values.password}
          onChange={handleChange}
        />

        <button onClick={() => {
          inputRef.current.focus();
        }}>
          focus
        </button>


        </>

    </div>
  );

};


export default App;
