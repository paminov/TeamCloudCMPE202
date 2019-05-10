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
            this.setState({ transactions: transactions.Items });
        } catch (e) {
            alert(e);
        }
        this.setState({ isLoading: false });
    }

    transactions() {
        return API.get("","/transactions")
    }

    render() {
        const { transactions } = this.state;
        return (
            <div>
                {
                    transactions.map((item) => {
                        const { menuItems } = item;
                        return (
                            <ListGroup variant="flush">
                                    {
                                        menuItems.map((menuItem) => {
                                            return <ListGroupItem>{`${menuItem.name} - $${Number(menuItem.cost).toFixed(2)}`}</ListGroupItem>
                                        })
                                    }
                                <ListGroupItem><strong>Total: </strong>{`$${Number(item.totalCost).toFixed(2)}`}</ListGroupItem>
                            </ListGroup>)
                        })
                }
            </div>
        );
    }
}