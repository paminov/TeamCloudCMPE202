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
            checkingOut: false
        };
    }

    async componentDidMount() {
        this.getMenuItems()
        this.fetchCart()
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

    addToCart = (index) => {
        const { menu } = this.state;
        console.log(index);
        const item = menu[index];
        API.patch("","/cart", {
            body: item
        })
        this.fetchCart();
    }

    endCheckout = () => {
        this.setState({ checkingOut: false });
      }
    
    showCheckout = () => {
        console.log('showcheckout')
        this.setState({ checkingOut: true });
    }

    renderMenu() {
        const { menu } = this.state;
        return menu.map((item, i) =>
            <tr>
                <td>{item.name.toLowerCase()}</td>
                <td>{item.cost}</td>
                <td class="addToCart"><Button bsStyle="success" onClick={() => this.addToCart(i)}><i className="fas fa-plus fa-fw"></i>Add to cart</Button></td>
            </tr>
        );
    }

    render() {
        const { isLoading, cart, totalCost } = this.state;
        const modal = (
           <Modal show={this.state.checkingOut} onHide={this.endCheckout}>
                <Modal.Header closeButton>
                <Modal.Title>Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Pay Here</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={this.endCheckout}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={this.endCheckout}>
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
                        <i className="fas fa-shopping-cart fa-fw" />{cart.length} items ($ {totalCost})
                        <Button onClick={this.showCheckout} className="button-ml" bsStyle="warning" disabled={cart.length === 0}>Checkout</Button>
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