import React, {useEffect, useRef, useState} from "react";
import "./App.css";
import ml5 from "ml5";
import GaugeChart from "./GaugeChart";
import useInterval from "./useInterval";

function App() {

  const videoRef = useRef();
  const [gaugeData, setGaugeData] = useState([0.5,0.5]);
  const [shouldClassify, setShouldClassify] = useState(false);

  useEffect(() => {
    classifier = ml5.imageClassifier("./my-model/model.json", () => {
      navigator.mediaDevices
      .getUserMedia({video: true, audio: false})
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      });
    });
  }, []);

  useIterval(() => {
    if(classifier && shouldClassify) {
      classifier.classify(videoRef.current, (error, results) => {
        if(error){
          console.log(error);
          return;
        }

        results.sort((a,b) => b.label.localCompare(a.label));
        setGaugeData(results.map(enrtry => entry.confidence));
      });
    }
  }, 500);

  return (
    <React.Fragment>
      <h1>
        Is Colin there? <br/>
        <small>
          [{gaugeData[0].toFixed(2)}, {gaugeData[1].toFixed(2)}]
        </small>
      </h1>

      <GaugeChart data={gaugeData} />
      <button onClick={()=> setShouldClassify(!shouldClassify)}>
        {shouldClassify ? "Stop classifying" : "Start classifying"}
      </button>

      <video
        ref={videoRef}
        style={{transform: "scale(-1,1)"}}
        width="300"
        height="150"/>

      </React.Fragment>
  );
}

export default App;
