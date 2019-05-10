import React, { Component } from "react";
import { API } from "aws-amplify";
import "./History.css";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export default class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            transactions: [],
        };
    }


    async componentDidMount() {
        this.getTransactions()
    }

    async getTransactions() {
        try {
            const transactions = await this.transactions();
            this.setState({ transactions: transactions.Item });
        } catch (e) {
            alert(e);
        }
        this.setState({ isLoading: false });
    }

    transactions() {
        return API.get("","/transactions")
    }

    renderTransactions = () => {
        const { transactions } = this.state;
        transactions.map((item) => {
            return <ListGroupItem>{item.totalCost.toFixed(2)}</ListGroupItem>
        })
    }

    render() {
        const { transactions } = this.state;
        console.log(transactions);
        return (
            <div>
                <ListGroup variant="flush">
                    {/* { transactions && this.renderTransactions() } */}
                </ListGroup>
            </div>
        );
    }
}