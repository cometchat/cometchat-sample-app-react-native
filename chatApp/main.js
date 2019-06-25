import React, { Component } from 'react';
import App from './App';
import { MenuProvider } from 'react-native-popup-menu';

export default class Main extends Component{
  
    constructor(props){
        super(props);
    }

    render(){
    return(
        <MenuProvider>
            <App />
        </MenuProvider>
     );
    }

}