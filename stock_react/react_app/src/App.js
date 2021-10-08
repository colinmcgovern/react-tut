import React, {useRef, useEffect, useState, Component} from 'react'
import './App.css';
import ZoomableLineChart from './ZoomableLineChart'
import {select, axisBottom, axisRight, scaleLinear, scaleBand} from "d3"
import { appl } from "./appl";

function App() {

  // const getData= ()=>{
  //    // fetch('http://127.0.0.1:5000/APPL', {
  //      fetch('http://colinmcgovern.com', {
  //    // fetch('https://api.randomuser.me', {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     "Access-Control-Allow-Origin": "*"
  //   },
  //    })
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  //   .catch((error) => {
  //     console.error(error)
  //   });
  // };

  // const getData = async() => {
  //   const api_call = await fetch(`http://127.0.0.1:5000/APPL`, {
  //     mode: "no-cors"
  //   });
  //   // const data = await api_call.json();
  //   const data = await api_call.json();
  //   console.log(data);
  //   }

  // const getData=()=>{
  //   fetch('http://127.0.0.1:5000/APPL'
    // ,{
    //   headers : {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     'Access-Control-Allow-Origin' : '*'
    //    }
    // }
    // )
    //   .then(function(response){
    //     console.log(response)
    //     return response.json();
    //   })
    //   .then(function(myJson) {
    //     console.log(myJson);
    //   });
  // }
  // useEffect(()=>{
  //   getData()
  // },[])

  return (
    <React.Fragment>
    <ZoomableLineChart data={appl} />
    </React.Fragment>
  );
}

export default App;
