import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics'

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCRVsw-_sTUj482_3zd43Gc0W4nea6n0Bk',
  authDomain: 'mag-s-project.firebaseapp.com',
  projectId: 'mag-s-project',
  storageBucket: 'mag-s-project.appspot.com',
  messagingSenderId: '384469548104',
  appId: '1:384469548104:web:e6f2d3fa6dba18f1f32c7d',
  measurementId: 'G-064MFK03XB',
};

// Initialize Firebase
 initializeApp(firebaseConfig);
 getAnalytics();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
