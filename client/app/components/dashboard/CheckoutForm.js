import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import './Dashboard.less';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {

    let {token} = await this.props.stripe.createToken({name: "Name"});
    this.props.onSubmitCard(token);

  }

  render() {
    return (
      <div>
        <CardElement 
        className = "StripeElement"
        style={{
            base: {
                //iconColor: '#666EE8',
                //color: '#31325F',
                //fontWeight: 300,
                //fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '25px',

                '::placeholder': {
                    color: '#CFD7E0',
                }
            }
        }}
        />
        <button 
        onClick={this.submit}
        className="btn-primary create-balance-btn"
        > Finish Buyer Setup </button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);