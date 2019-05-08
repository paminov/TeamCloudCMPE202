import React, { Component, Fragment } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, Table, Button, ButtonToolbar, Row, Col } from "react-bootstrap";
import Cards from 'react-credit-cards';
import { API } from "aws-amplify";
import "./Payments.css";
import 'react-credit-cards/es/styles-compiled.css';

export default class Payments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRequesting: false,
            number: '',
            cvc: '',
            balance: '',
            cards: [],
            isLoading: true,
            name: null
        };
    }


    async componentDidMount() {
        this.getCard();
        const currentUser = await Auth.currentAuthenticatedUser();
        const { attributes: { family_name, given_name } } = currentUser;
        this.setState({ name: `${given_name} ${family_name}` })
    }

    async getCard() {
        try {
            const card = await this.card();
            if (card) {
                this.setState({
                    number: card.cardNumber,
                    balance: card.balance,
                    cvc: card.pin,
                });
            }
        } catch (e) {
            alert(e);
        }
        this.setState({ isLoading: false });
    }

    card() {
        return API.get("","/card")
    }

    cardAdd = () => {
        const { balance, number, cvc } = this.state;
        API.post("","/card", {
            body: {
                cardNumber: number,
                pin: cvc,
                balance,
            }
        })
    }

    validateForm() {
        return this.state.number.length > 0 && this.state.cvc.length > 0 && this.state.balance.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value,
            focused: event.target.id,
        });
    }

    addCard = () => {

    }

    render() {
        const { isLoading } = this.state;
        return (
            <Fragment>
                <h4 className="sub-title">Manage my cards</h4>
                <div className='rowC'>
                    <div className="w-50">
                        <Cards
                            number={this.state.number}
                            name={this.state.name}
                            cvc={this.state.pin}
                            focused={this.state.focused}
                            name={this.state.name}
                        />
                    </div>
                    <div className="w-50">
                        <FormGroup controlId="number" bsSize="large">
                            <FormControl
                                autoFocus
                                value={this.state.number}
                                onChange={this.handleChange}
                                placeholder="Card Number"
                                type="number"
                            />
                        </FormGroup>
                        <Row>
                            <Col xs={7}>
                                <FormGroup controlId="cvc" bsSize="large">
                                    <FormControl
                                        value={this.state.cvc}
                                        onChange={this.handleChange}
                                        placeholder="Pin"
                                        type="number"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={5}>
                                <FormGroup controlId="balance" bsSize="large">
                                    <FormControl
                                        value={this.state.balance}
                                        onChange={this.handleChange}
                                        placeholder="Balance ($)"
                                        type="number"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <ButtonToolbar>
                            <Button className="btn btn-default pull-right btn-success" disabled={!this.validateForm()} onClick={this.cardAdd}>
                                Update Card
                            </Button>
                        </ButtonToolbar>
                    </div>
                </div>
            </Fragment>
        );
    }
}