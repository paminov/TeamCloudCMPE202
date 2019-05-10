import React, { Component } from "react";
import "./Order.css";
import { API } from "aws-amplify";
import { Table, Button, Modal } from "react-bootstrap";

export default class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            menu: [],
            cart: [],
            totalCost: 0,
            checkingOut: false,
            balance: null,
        };
    }

    async componentDidMount() {
        this.getMenuItems()
        this.fetchCart()
        this.getCard();
    }

    async getMenuItems() {
        try {
            const menu = await this.menu();
            this.setState({ menu: menu.Items });
        } catch (e) {
            alert(e);
        }
        this.setState({ isLoading: false });
    }

    menu() {
        return API.get("","/menu")
    }

    async fetchCart() {
        try {
            const cart = await this.cart();
            this.setState({ cart: cart.menuItems, totalCost: cart.totalCost });
        } catch (e) {
            alert(e);
        }
    }

    cart() {
        return API.get("","/cart")
    }

    async getCard() {
        try {
            const card = await this.card();
            if (card) {
                this.setState({
                    balance: card.balance,
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

    addToCart = async (index) => {
        const { menu } = this.state;
        console.log(index);
        const item = menu[index];
        const cart = await API.patch("","/cart", {
            body: item
        })
        this.setState({
            totalCost: cart.totalCost,
            cart: cart.menuItems,
        })
    }


    removeFromCart = async (index) => {
        const cart = await API.del("",`/cart/${index}`)
        this.setState({
            totalCost: cart.totalCost,
            cart: cart.menuItems,
        })
    }

    endCheckout = async (type) => {
        if (type === 'cancel') {
            this.setState({ checkingOut: false });
            return
        }
        await this.processPayment();
        await this.fetchCart();
        await this.getCard();
        this.setState({ checkingOut: false });
    }

    async processPayment() {
        try {
            await this.pay();
        } catch (e) {
            alert(e);
        }
    }

    pay() {
        return API.post("","/transactions")
    }

    showCheckout = () => {
        console.log('showcheckout')
        this.setState({ checkingOut: true });
    }

    renderMenu() {
        const { menu, totalCost, balance, cart } = this.state;
        return menu.map((item, i) =>
            {
                const noFundsRemaining = Number(balance) < (Number(totalCost) + Number(item.cost));
                let isInCart = cart.findIndex(cartItem => cartItem.name === item.name);
                return (<tr>
                    <td>{item.name.toLowerCase()}</td>
                    <td>{item.cost}</td>
                    <td class="addToCart"><Button bsStyle="success" onClick={() => this.addToCart(i)} disabled={noFundsRemaining || isInCart !== -1}><i className="fas fa-plus fa-fw"></i>Add to cart</Button></td>
                    <td class="addToCart"><Button bsStyle="danger" onClick={() => this.removeFromCart(isInCart)} disabled={isInCart === -1}><i className="fas fa-minus fa-fw"></i>Delete</Button></td>
                </tr>)
            }
        );
    }

    render() {
        const { isLoading, cart, totalCost, balance } = this.state;
        let cost = totalCost.toFixed(2);
        if(cost == -0.00){
            cost = 0.00;
        }
          
        const modal = (
           <Modal show={this.state.checkingOut} onHide={this.endCheckout}>
                <Modal.Header closeButton>
                <Modal.Title>Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body className="grid center">
                    {
                        cart.map((item) => {
                          return <span>{item.name}</span>
                        })
                    }
                    <hr/>
                    ${ cost }
                </Modal.Body>
                <Modal.Footer>
                <Button bsStyle="secondary" onClick={() => this.endCheckout('cancel')}>
                    Cancel
                </Button>
                <Button bsStyle="primary" onClick={this.endCheckout}>
                    Pay
                </Button>
                </Modal.Footer>
          </Modal>
        )
        return (
            <div>
                {!isLoading && 
                <div className="menu-holder">
                    <span className="shopping-cart pull-right">
                        <i className="fas fa-shopping-cart fa-fw" />{cart.length} items ($ {cost})
                        <Button onClick={this.showCheckout} className="button-ml" bsStyle="warning" disabled={cart.length === 0}>Checkout</Button>
                    </span>
                    <span className="shopping-cart pull-right mt-5">
                        <i className="fas fa-credit-card fa-fw" />$ {Number(balance).toFixed(2)} balance
                    </span>
                    <Table borderless hover variant="dark">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.renderMenu() }
                        </tbody>
                    </Table>
                    { modal }
                </div>
                }
            </div>
        );
    }
}