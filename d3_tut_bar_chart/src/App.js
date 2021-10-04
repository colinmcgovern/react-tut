import React, {useRef, useEffect, useState} from 'react'
import './App.css';
import BarChart from './BarChart'
import {select, axisBottom, axisRight, scaleLinear, scaleBand} from "d3"

function App() {

  const [data, setData] = useState([10,20,40,50,100,20,100,300]);

  return (
    <React.Fragment>
    <BarChart data={data}/>
      <br/>
      <br/>
      <br/>
      <br/>
      <button onClick={()=>setData(data.map(value=>value+5))}>
        increase
      </button>
      <button onClick={()=>setData(data.filter(value=>value<30))}>
        filter
      </button>
      <button onClick={()=>setData([...data,Math.round(Math.random()*100)])}>
        Add data
      </button>
    </React.Fragment>
  );
}

export default App;
