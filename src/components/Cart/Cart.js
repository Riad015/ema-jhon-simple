import React from 'react';

const Cart = (props) => {
    const cart = props.cart;
    const total = cart.reduce((total,prd) => total + prd.price , 0)
    const allTotal = Math.round(total);
        return (
        <div>
            <h4>Order Summary</h4>
            <p>Waiting for place : {cart.length}</p>
            <p>Total Price : $ {allTotal}</p>
        </div>
    );
};

export default Cart;