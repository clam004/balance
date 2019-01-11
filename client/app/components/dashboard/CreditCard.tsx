import * as React from 'react';
import './Dashboard.less';
import * as moment from 'moment';

import { RouteComponentProps, Link } from 'react-router-dom';

import { storeConnectAcctToken, 
         storeCustomerID,
         getConnectData,
         chargeCerditCard } from '../../helpers/transactions';  

import { logout, getUserData, isLoggedIn } from '../../helpers/auth';
import { HttpResponse, get, post, del } from '../../helpers/http';

import { SideNav } from '../nav';

import {Elements, StripeProvider} from 'react-stripe-elements';

import CheckoutForm from './CheckoutForm';

const STRIPE_PUBLIC_KEY = 'pk_test_pj9vyeLEvE4TGmOk3mNLdSOo' // 'pk_live_pPMLqeBq8P6rEFHwEmiWHmjx'

interface AccountProps extends RouteComponentProps<{}> {}

interface AccountState {
  isLoading: boolean,
  user_id:number,
  has_connect_account:boolean,
  has_customer_id:boolean,
  user_email:string,
  first_name: string,
  last_name: string,
  dob_day: number,
  dob_month: number,
  dob_year: number,
  birthday_string:string,
  account_error:string
}

class CreditCard extends React.Component<AccountProps & RouteComponentProps<{}>, AccountState> {

  constructor(props: AccountProps & RouteComponentProps<{}>) {

    super(props);

    this.state = {
      isLoading:false,
      user_id:null,
      has_connect_account:null,
      has_customer_id:null,
      user_email:null,
      first_name:"",
      last_name:"",
      dob_day:null,
      dob_month:null,
      dob_year:null,
      birthday_string:"",
      account_error:null,
    }
    
    //this.handleDepositSuccess = this.handleDepositSuccess.bind(this)
    //this.handleSendSuccess = this.handleSendSuccess.bind(this)
  }
 
  componentDidMount() {
    
    this.setState({ isLoading: true });

    const { history } = this.props;
  
    isLoggedIn()
    .then((res)=>{
      if (!res.is_logged_in) {
        history.push('/login');
      }
    })
    
    getUserData()
    .then(userdata => {  
      if (userdata) {

        console.log("userdata", userdata[0]);
        let has_connect_account = false;
        let has_customer_id = false;

        var stripe_connect_account_token = userdata[0].stripe_connect_account_token

        if (stripe_connect_account_token) {
          has_connect_account = true;

          getConnectData({stripe_connect_account_token:stripe_connect_account_token})
          .then(connect_data => {
            this.setState({
              first_name:connect_data.first_name,
              last_name:connect_data.last_name,
              dob_day:connect_data.dob_day,
              dob_month:connect_data.dob_month,
              dob_year:connect_data.dob_year,
              birthday_string:connect_data.dob_month+"/"+connect_data.dob_day+"/"+connect_data.dob_year,
            }); 
          });
        }

        if (userdata[0].stripe_customer_id) {
          has_customer_id = true;
        }

        this.setState({
          user_id:userdata[0].id,
          has_connect_account:has_connect_account,
          has_customer_id:has_customer_id,  
          user_email:userdata[0].email, 
          isLoading:false
        }); 
      }
    });
  }

  public renderUserInfoForm(): JSX.Element {

    const { 
      first_name, 
      last_name,
      dob_day,
      dob_month,
      dob_year,
      birthday_string,
      isLoading 
    } = this.state;

    var error_message;

    if (this.state.account_error) {
      error_message = <div>{this.state.account_error}</div>
    } else {
     error_message = <div></div>
    } 

    return (

    <div>

      <label className="label-default">first name</label>
      <input
        className="input-default full-width"
        type="text"
        placeholder="first name"
        value={first_name || ""}
        onChange={e => this.setState({ first_name: e.target.value })}
      />

      <label className="label-default">last name</label>
      <input
        className="input-default full-width"
        type="text"
        placeholder="last name"
        value={last_name || ""}
        onChange={e => this.setState({ last_name: e.target.value })}
      />

      <label className="label-default">birthday (month/day/year) </label>
      <input
        className="input-default full-width"
        type="text"
        placeholder="mm/dd/yyyy"
        value={birthday_string || ""}
        onChange={e => {

          this.setState({ birthday_string: e.target.value }, () => {

            var str_array = this.state.birthday_string.split("/");
            
            if (str_array.length == 3) {
              var day = parseInt(str_array[1], 10)
              var month = parseInt(str_array[0], 10)
              var year = parseInt(str_array[2], 10)
              
              if (day > 0 && day < 32 && month > 0 && month < 13 && 
                  year > 0 && year < new Date().getFullYear()) {
                  this.setState({
                    dob_year:year,
                    dob_month:month,
                    dob_day:day,
                  }) 
              }
            }
          })
        }}
      />

      <h3>{error_message}</h3>

    </div>

    );

  }

  public renderTermsOfService(): JSX.Element {

    if (this.state.has_connect_account) {

      return (
        <div> 

        </div>
      )

    } else {

      return (

       <div className="form-group"> 

          <h3> Terms of Service </h3>
          To participate we need your account information. This is just for 
          holding each party accountable. Simply entering your information 
          will not result in a charge. Your account will only be charged 
          when you give permission, such as at the conclusion of an active
          Balance contract. Balance contracts can only be made active with 
          your approval. 
          <br/><br/>

          Payment processing services on Balance are provided by 
          Stripe and are the subject to the 
          <Link to="https://stripe.com/us/connect-account/legal"> 
           Stripe Connected Account Agreement </Link>
          , which includes 
          <Link to="https://stripe.com/us/legal"> Stripe Terms of Service. </Link>
          By agreeing to  these terms or continuing to operate on Balance, you agree to be 
          bound by the Stripe Services Agreement, as the same may be modified by 
          Stripe from time to time. As a condition of Balance enabling 
          payment processing services through Stripe, you agree to provide 
          Balance accurate and complete information about you or your 
          business, and you authorize Balance to share it and transaction 
          information related to your use of the payment processing services 
          provided by Stripe. 
          <br/><br/>
          By setting up your account to receive payments, the information 
          you have provided will be saved and you will be indicating that you
          agree to these terms. 
          <br/>

      </div>

      )
    }
  }

  public renderGetReceiveAccount(): JSX.Element {

    if (this.state.has_connect_account && this.state.has_customer_id) {
      return (
        <div> 

          Payment information has been submitted successfully. Account setup is COMPLETE. 

          <button 
          onClick={()=>this.setState({has_connect_account:false, has_customer_id:false})}
          className="btn-primary create-balance-btn"
          > 
          Update Payment Information
          </button>

        </div>
      )
    } else if (!this.state.has_connect_account && !this.state.has_customer_id) {

      return (

        <div>Handle Deposit info</div>
      )
    }
  }

  public renderGetSendAccount(): JSX.Element {

    if (this.state.has_connect_account && this.state.has_customer_id) {
      return (
        <div></div>
      )
    } else if (this.state.has_connect_account && !this.state.has_customer_id) {

      return (
        <div>
          
          <label>
            <div>
              <h3> setup your payment method (buyer setup) </h3>
              <br/><br/>
              <StripeProvider apiKey={STRIPE_PUBLIC_KEY}>

                  <Elements>
                    <CheckoutForm onSubmitCard={this.handleCreditCard} />
                  </Elements>

              </StripeProvider>
              <br/><br/>
            </div>
          </label>

        </div>
      )
    }
  }

  public handleCreditCard(token): void {

    //makeStripeCustomerID({token_id:token.id})
    chargeCerditCard({token_id:token.id})
    .then(res => {
      console.log("Customer Response", res)
    });

  }

  render() {
    
    var user_email = this.state.user_email 

    console.log('state at render ', this.state)

    var user_alias = "You"

    if (user_email) {
      user_alias = user_email.substr(0, user_email.indexOf('@')); 
    }

    return (

      <div className="dashboard-container">
        <SideNav />
        <main className="main-container">
          <div className="main-header">
            <img className="main-logo" src="assets/logo-white.svg" />
            <h3> {user_alias} 's Account </h3>
          </div>
          
          <div className="user-info-container">

            {this.renderUserInfoForm()}

          </div>

          <br/><br/>

          <div className="user-info-container">

            {this.renderTermsOfService()}

          </div>

          <section className="create-balance-container">

            {this.renderGetReceiveAccount()}

          </section>

          <section className="create-balance-container">

            {this.renderGetSendAccount()}

          </section>

        </main>
      </div>
    );
  }
}

export default CreditCard;
