import React, { Component } from 'react';
import LoginForm from './LoginForm/LoginForm';
import { hasInternetAccess } from '../actions/url'

class App extends Component {
  componentWillMount(){
    if(localStorage.getItem('language') == null){
      localStorage.setItem('language', "en")
    }  
  }
  render() {
    return (
      <div>
        <LoginForm useCaptcha={hasInternetAccess} />
      </div>
    );
  }
}

export default App;
