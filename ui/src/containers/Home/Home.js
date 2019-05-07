import React, { Component } from "react";
import { Tab, Tabs, Jumbotron } from "react-bootstrap";
import Login from "../Login/Login";
import "./Home.css";
import Order from "../Order/Order";
import Payments from "../Payments/Payments";
import History from "../History/History";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            isLoggedIn: false,
            firstname: null,
            lastname: null
        };
    }

    async componentDidMount() {
        const { isLoggedIn } = this.props;
        if (!isLoggedIn) {
            return;
        }
        this.setState({isLoggedIn});
    }

    renderHome() {
        return (
            <div className="home-page">
                Home
            </div>
        );
    }

    renderLander = () => {
        return <Login userHasAuthenticated={this.props.userHasAuthenticated}/>;
    }

    render() {
        return (
            <div>
                {this.props.isLoggedIn ? this.renderHome() : this.renderLander()}
            </div>
        );
    }
}