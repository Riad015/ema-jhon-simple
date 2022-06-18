import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import './Product.css'

const Product = (props) => {
    return (
        <div className="product">
            <div>
                <img src={props.product.img} alt="" />
            </div>
            <div>
                 <h4 class="product-name">{props.product.name}</h4>
                 <br />
                 <p><small>by : {props.product.seller}</small></p>
                 <p>${props.product.price}</p>
                 <p><small>Only {props.product.stock} left</small></p>
                 <button onClick={() => props.handleAddProduct(props.product)} class="main-button"> <FontAwesomeIcon icon={faCoffee} /> add to cart</button>
            </div>
        </div>
    );
};

export default Product;