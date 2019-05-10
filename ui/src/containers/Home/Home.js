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
            lastname: null,
            key: 'order',
        };
    }

    async componentDidMount() {
        const { isLoggedIn } = this.props;
        if (!isLoggedIn) {
            return;
        }
        this.setState({isLoggedIn});
    }

    renderTab = (key) => {
        if (key === 'order') {
            return <Order />
        } else if (key === 'payments') {
            return <Payments />
        } else if (key === 'history') {
            return <History />
        }
    }

    renderHome() {
        return (
            <div className="home-page">
                <Jumbotron>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={this.state.key}
                            onSelect={key => this.setState({ key })}
                        >
                        <Tab eventKey="payments" title="Payments">
                            <div className="tab-container">
                                { this.renderTab(this.state.key) }
                            </div>
                        </Tab>
                        <Tab eventKey="order" title="Order">
                            <div className="tab-container">
                                { this.renderTab(this.state.key) }
                            </div>
                        </Tab>
                        <Tab eventKey="history" title="History">
                            <div className="tab-container">
                                { this.renderTab(this.state.key) }
                            </div>
                        </Tab>
                    </Tabs>
                </Jumbotron>
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