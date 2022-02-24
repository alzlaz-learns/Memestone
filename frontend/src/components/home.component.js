import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import SwipeComponent from './SwipeComponent';
import authService from '../services/auth.service';
import bigLogo from '../assets/logo_big.png';

/*
* Home page gateway, displaying the SwipeComponent when logged in and a welcome message when logged out
*/
export default class Home extends React.Component{
    constructor(props) {
        super(props);
    
        this.state = {
          signedIn: false,
          redirect: null,
        };
      }
    
      componentDidMount() {
        let user = authService.getCurrentUser();
        if (!user) this.setState({ redirect: "/login" });
        if (user) {
            this.setState({
                signedIn: true
              });
        }
      }
    
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
          }
          else{
        if (!this.state.signedIn)
        return (
            <div className="content" key={Date.now()}>
                <h3>Welcome!</h3>
                <br/>
                <Link to="/login" className="btn btn-primary" style={{marginRight: "5px"}}>Log in</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
                <img src={bigLogo} alt="Website logo" style={{width: "300px", display: "block"}}></img>
            </div>
        );

        return (
            <div className="content" key={Date.now()}>
                <h4>Home</h4>
                <SwipeComponent></SwipeComponent>
            </div>
        );
          }
    }
}