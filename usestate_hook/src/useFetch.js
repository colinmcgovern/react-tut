import {useEffect,useState} from 'react'

export const useFetch = url => {

  const [state, setState] = useState({data: state.data, loading: true});

  useEffect(() => {
    setState(state => ({data:null, loading: true}));
    fetch(url)
      .then(x => x.text())
      .then(y => {
        setState({data:y, loading: false})
      });
  }, [url, setState]);

  return state;
};
