import logo from './logo.svg';
import './App.css';

import Posts from './components/Posts'
import PostForm from './components/PostForm'

import {Provider} from 'react-redux'
import store from './store'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Posts/>
        <PostForm/>
      </Provider>
    </div>
  );
}

export default App;
