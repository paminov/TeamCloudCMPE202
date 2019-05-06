import React, { Component } from "react";
import { Auth } from "aws-amplify";
import {
FormGroup,
FormControl,
ControlLabel,
Button,
ButtonToolbar
} from "react-bootstrap";
import "./Signup.css";

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: "",
            password: "",
            firstname: "",
            lastname: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null
        };
    }

    validateForm() {
        return (
            this.state.firstname.length > 0 &&
            this.state.lastname.length > 0 &&
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        try {
            const newUser = await Auth.signUp({
                username: this.state.email,
                password: this.state.password,
                'attributes': {
                    given_name: this.state.firstname,
                    family_name: this.state.lastname    
                }
            });
        this.setState({newUser});
        } catch (e) {
            alert(e.message);
        }
        this.setState({ isLoading: false });
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            await Auth.signIn(this.state.email, this.state.password);
            window.location.reload();
            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    }

    renderConfirmationForm() {
        return (
            <div className="login-container shadow">
                <form onSubmit={this.handleConfirmationSubmit}>
                    <FormGroup controlId="confirmationCode" bsSize="large">
                        <ControlLabel>Confirmation Code</ControlLabel>
                        <FormControl
                            autoFocus
                            type="tel"
                            value={this.state.confirmationCode}
                            onChange={this.handleChange}
                            placeholder="Check email for code"
                        />
                    </FormGroup>
                    <ButtonToolbar>
                        <Button disabled={!this.validateConfirmationForm()} className="btn btn-default pull-right" type="submit">
                            Verify account
                        </Button>
                    </ButtonToolbar>
                </form>
            </div>
        );
    }

    renderForm() {
        return (
            <div className="login-container shadow">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="firstname" bsSize="large">
                        <ControlLabel>First Name</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.firstname}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="lastname" bsSize="large">
                        <ControlLabel>Last Name</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.lastname}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
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
                    <FormGroup controlId="confirmPassword" bsSize="large">
                        <ControlLabel>Confirm Password</ControlLabel>
                        <FormControl
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <ButtonToolbar>
                        <Button disabled={!this.validateForm()} className="btn btn-default pull-right" type="submit">
                            Sign Up
                        </Button>
                    </ButtonToolbar>
                </form>
            </div>
        );
    }

    render() {
        return (
            <div className="Signup">
                {this.state.newUser === null ? this.renderForm() : this.renderConfirmationForm()}
            </div>
        );
    }
}