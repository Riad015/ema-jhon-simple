import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import fakeData from '../../fakeData';
import { getDatabaseCart, processOrder, removeFromDatabaseCart } from '../../utilities/databaseManager';
import ReviewItem from '../ReviewItem/ReviewItem';
import Cart from '../Cart/Cart'
import happayImage from '../../images/giphy.gif'

const Review = () => {
    const [cart, setCart] = useState([]);
    const [orderPlace, setOrderPlace] = useState(false);
    const history = useHistory()

    const handleProceedCheckout = () =>{
        history.push('/shipment');
    }

    const removeProduct = (productKey) => {
        const newCart = cart.filter(pd => pd.key !== productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }

    useEffect(()=>{
        //cart
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart); //array theke just key nicche
        const cartProducts = productKeys.map( key => {
            const product = fakeData.find(pd => pd.key ===key);
            product.quantity = savedCart[key];
            return product;
        });
        setCart(cartProducts);
    }, []);

    let thankyou;
    if(orderPlace){
        thankyou  = <img src={happayImage} alt="" />
    }
    return (
        <div className='twin-container'>
            <div className='product-container'>
            {
                cart.map(pd => <ReviewItem 
                    key = {pd.key}
                    removeProduct = {removeProduct}
                    product = {pd}></ReviewItem>)
            }
            {
                thankyou
            }
            </div>
            <div className='cart-container'>
                    <Cart cart={cart}>
                        <button onClick={handleProceedCheckout} className='main-button'>Proceed Checkout</button>
                    </Cart>
            </div>
        </div>
    );
};

export default Review;