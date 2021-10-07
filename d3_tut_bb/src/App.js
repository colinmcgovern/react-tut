import React, { useEffect, useState } from "react";
import BBTimeline from "./BBTimeline";
import "./App.css";
import ReactScrollWheelHandler from "react-scroll-wheel-handler";

function App() {
  const [bbEpisodes, setBbEpisodes] = useState([]);
  const [bbCharacters, setBbCharacters] = useState([]);
  const [highlight, setHighlight] = useState();
  const [zoom_percent, setZoom_percent] = useState(1.0);

  useEffect(() => {
    fetch("https://www.breakingbadapi.com/api/characters?category=Breaking+Bad")
      .then(response => response.ok && response.json())
      .then(characters => {
        setBbCharacters(
          characters.sort((a, b) => a.name.localeCompare(b.name))
        );
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("https://www.breakingbadapi.com/api/episodes?series=Breaking+Bad")
      .then(response => response.ok && response.json())
      .then(episodes => {
        console.warn(episodes);
        setBbEpisodes(episodes);
      })
      .catch(console.error);
  }, []);

  return (
    <React.Fragment>
      <h1>Breaking Bad Timeline</h1>

      <ReactScrollWheelHandler
        upHandler={(e) => setZoom_percent(zoom_percent + .1)}
        downHandler={(e) => zoom_percent > 1 ? setZoom_percent(zoom_percent - .1) : null}
      >
        <BBTimeline highlight={highlight} data={bbEpisodes} zoom_percent={zoom_percent}/>
      </ReactScrollWheelHandler>

      <h2>Select your character</h2>
      <select value={highlight} onChange={e => setHighlight(e.target.value)}>
        <option>Select character</option>
        {bbCharacters.map(character => (
          <option key={character.name}>{character.name}</option>
        ))}
      </select>
    </React.Fragment>
  );
}

export default App;
