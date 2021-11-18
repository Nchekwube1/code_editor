import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Cell from './compnents/Cell';

function App() {

  return (
    <div className="App">
   <Cell/>

    </div>
  );
}

export default App;




ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

