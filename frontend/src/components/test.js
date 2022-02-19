import React, { Component } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

import TinderCard from "react-tinder-card";
export default class Test extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          content: ""
        };
      }
      componentDidMount() {
        UserService.getUserBoard().then(
          response => {
            this.setState({
              content: response.data
            });
          },
          error => {
            this.setState({
              content:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString()
            });
            

          }
        );
      }

      render() {
        return (
          <div>
              <h3>{this.state.content}</h3>
              <h3>
                this is a test page
                test
                </h3>
                <TinderCard />
          </div>
        );
      }

    }