import React from 'react'
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './component_styling/main.scss'
import axios from 'axios'
import AppRouter from './Components/Router'

export const axios_instance = axios.create({
  baseURL: 'https://jmsa-tutoring-backend.herokuapp.com/'
});

axios_instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


ReactDOM.render(
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>,
      document.getElementById('root')

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://it.ly/CRA-vitals
reportWebVitals();
//export default socket;
