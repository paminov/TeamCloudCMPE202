import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Login.css";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isLoading: false
        };
    }
    
    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true })
        try {
            await Auth.signIn(this.state.email, this.state.password);
            window.location.reload();
            this.props.userHasAuthenticated(true);
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false })
        }
    }

    render() {
        return (
            <div className="Login">
                <div className="login-container shadow">
                    <h1 style={{marginRight: "10px"}}><i className="fa fa-coffee"/>Starbucks</h1>
                    <p>Login and order now</p>
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="email" bsSize="large">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                autoFocus
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="password" bsSize="large">
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={this.handleChange}
                                type="password"
                            />
                        </FormGroup>
                        <ButtonToolbar>
                            <Button className="btn btn-default pull-right btn-success" disabled={!this.validateForm()} type="submit">
                                Login
                            </Button>
                            <LinkContainer to={"/signup"}>
                                <Button bsStyle="success" className="btn btn-default pull-right">
                                    Sign Up
                                </Button>
                            </LinkContainer>
                        </ButtonToolbar>
                    </form>
                </div>
            </div>
        );
    }
}