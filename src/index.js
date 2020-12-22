import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import {App} from './Main';
import {
  BrowserRouter as Router
} from "react-router-dom";


// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

//ReactDOM.render(<NavBar />, document.getElementById('root'));
ReactDOM.render(
<Router>
<App />
</Router>, 
document.getElementById('root'));
