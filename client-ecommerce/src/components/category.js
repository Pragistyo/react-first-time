import React, { Component } from 'react'
import swal from 'sweetalert'
import { withRouter } from 'react-router-dom';
import '../App.css'
import { connect } from 'react-redux'
import {
    changeLoginRegis,
    addCart,
    addCartFront,
    setTotalPrice,
    getCategory,
    setTitle
} from '../actions/generalAction'


class Categ extends Component {
    constructor(props) {
        super(props)
        let match = props.match
        this.state = {
            count: 0,
            match: match.params.category
        }
    }

    render() {
        return (
            <div className="mdl-cell--4-col">
                <div className="demo-card-square mdl-card mdl-shadow--2dp">
                    <div className="" align="center">
                        <img src={this.props.nama.img} alt="barang" />
                    </div>
                    <div className="mdl-card__title mdl-card--expand">
                        <h2 className="mdl-card__title-text">{this.props.nama.name}</h2>
                    </div>
                    <div className="mdl-card__supporting-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenan convallis.
                    </div>
                    <div className="mdl-card__actions mdl-card--border">
                        <p className="mdl-button mdl-button--colored mdl-js-button">
                            Price : Rp. {this.props.nama.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")},-
                        </p><br />
                        <p className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                            onClick={this.addToCart.bind(this, { objItem: this.props.nama, msg: 'Item Added !' })}>
                            <i className="material-icons">shop</i>
                            Cart : {this.state.count}
                        </p>
                    </div>
                </div><br /><br />
            </div>
        );
    }

    // componentWillMount() {
        //     this.props.title
        //     this.props.setTitle('All Item')
    // }
    
    componentDidMount() {
        this.props.setTitle(this.state.match)
        this.props.getCategory(this.state.match.toLowerCase())
    }
    
    componentWillReceiveProps(nextProps) {
        // Load new data when the dataSource property changes.
        // if(nextProps.cart != this.props.cart) {
        if (nextProps.cart.length === 0) {
            // this.loadData(nextProps.dataSource);
            this.setState({
                count: 0
            })
        }
    }

    addToCart(value) {
        this.alertCartFront.call(this, value.objItem)
        this.props.addCart(value.objItem._id)
        this.setState({
            count: this.state.count + 1
        })
        let arr = [value.objItem.name, value.msg]
        let alertStr = arr.join(', ')
        swal(`${alertStr}`, 'You Add This Item to Cart', 'success')
    }

    alertCartFront(product) {
        if (!product.quantity) {
            product.quantity = 0
        }
        var produkidx = this.props.cartFront.findIndex(item => {
            return item._id === product._id
        })
        if (produkidx === -1) {
            product.quantity += 1
            this.props.addCartFront(product)
            // Categ.calculatePrice.call(this) // pake async await di methode ini
        } else {
            const cartFront = [...this.props.cartFront]
            cartFront[produkidx].quantity = product.quantity + 1
            Categ.calculatePrice.call(this)
        }
    }

    static calculatePrice() {
        let total = 0;
        if (this.props.cartFront.length > 0) {
            this.props.cartFront.forEach(item => {
                let calc = item.price * item.quantity
                total += calc
            })
        } else {
            total = 0
        }
        this.props.setTotalPrice(total)
        // alert('ini price: ' + this.props.totalPrice)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeLoginRegis: (params) => dispatch(changeLoginRegis(params)),
        setTitle: (params) => dispatch(setTitle(params)),
        addCart: (params) => dispatch(addCart(params)),
        addCartFront: (params) => dispatch(addCartFront(params)),
        setTotalPrice: (params) => dispatch(setTotalPrice(params)),
        getCategory: (params) => dispatch(getCategory(params))
    }
}

const mapStateToProps = (state) => {
    // alert(JSON.stringify(state.lapak))
    return {
        formLoginRegis: state.lapak.formLoginRegis,
        totalPrice: state.lapak.totalPrice,
        cart: state.lapak.cart,
        allItem: state.lapak.allItem,
        cartFront: state.lapak.cartFront,
        totalPrice: state.lapak.totalPrice
    }
}

var ConnectedComponent = connect(
    mapStateToProps, mapDispatchToProps
)(Categ)


export default ConnectedComponent