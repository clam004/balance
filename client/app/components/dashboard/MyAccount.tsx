import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';

import { storeConnectAcctToken, 
         storeCustomerID,
         getConnectData,
         makeStripeCustomerID } from '../../helpers/transactions';  

import {  getBalances, 
          toggleConfirm, 
          toggleComplete, 
          balanceDone } from '../../helpers/usersbalances'; 

import { logout, getUserData } from '../../helpers/auth';
import { HttpResponse, get, post, del } from '../../helpers/http';
import './Dashboard.less';
import * as moment from 'moment';
import PlaidLink from 'react-plaid-link'
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

const { PLDPUBLISHABLE_KEY, STRIPE_PUBLIC_KEY } = require('./pldconfig');

const SideNav = () => {

  return (
    <nav className="side-nav-container">
      <div className="side-nav-header">
        <img className="side-nav-logo" src="assets/logo-green.svg" />
        <h3><Link to="/">Balance</Link></h3>
      </div>
      <ul className="side-nav-list">
        <li className="nav-item">
          <Link to="/dashboard">Current Balances</Link>
        </li>
        <li className="nav-item">
          <Link to="/history">History</Link>
        </li>
        <li className="nav-item">
          <Link to="/dashboard">Arbitrations</Link>
        </li>
        <li className="nav-item">
          <Link to="/dashboard">Support</Link>
        </li>
        <li className="nav-item active">
          <Link to="/myaccount">My Account</Link>
        </li>
        <li className="nav-item">
          <Link onClick={() => logout()} to="/">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

interface AccountProps extends RouteComponentProps<{}> {}

interface AccountState {
  isLoading: boolean,
  pldpublickey:string,
  strppublickey:string,
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
  address_line1: string,
  address_city: string,
  address_postal_code: string,
  address_state: string,
  country: string,
  country_str:string,
  ssn_last_4: string,
  account_error:string
}

class MyAccount extends React.Component<AccountProps, AccountState> {

  constructor(props: AccountProps) {

    super(props);

    this.state = {
      isLoading:false,
      pldpublickey:PLDPUBLISHABLE_KEY,
      strppublickey:STRIPE_PUBLIC_KEY,
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
      address_line1:null,
      address_city:null,
      address_postal_code:null,
      address_state:null,
      country:null,
      country_str:null,
      ssn_last_4:null,
      account_error:null,
    }
    
    this.handleDepositSuccess = this.handleDepositSuccess.bind(this)
    this.handleCreditCard = this.handleCreditCard.bind(this);
  }
 
  componentDidMount() {
    
    this.setState({ isLoading: true });
    
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
              address_line1:connect_data.address_line1,
              address_city:connect_data.address_city,
              address_postal_code:connect_data.address_postal_code,
              address_state:connect_data.address_state,
              country_str:connect_data.address_country,
              birthday_string:connect_data.dob_month+"/"+connect_data.dob_day+"/"+connect_data.dob_year,
              country:connect_data.address_country,
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

  public handleCreditCard(token): void {

    makeStripeCustomerID({token_id:token.id})
    .then(res => {
      console.log("Customer Response", res)
      if (res.success) {
        this.setState({has_customer_id:true})
      } else {
        console.log(res)
        alert("Credit Card and info not recognized together")
      }
    });

  }

  handleOnExit(err, metadata) {
    // handle the case when your user exits Link
    // The user exited the Link flow.
    console.log('err: ' + err);
    console.log('metadata: ' + metadata);
    if (err != null) {
      // The user encountered a Plaid API error prior to exiting.
    }
  }


  handleDepositSuccess(public_token, metadata) {
    // Send the public_token and account ID to your app server.
    console.log('DEPOSIT')
    console.log('public_token: ' + public_token);
    console.log('account ID: ' + metadata.account_id);
    //console.log('metadata: ' + metadata);
    this.setState({has_connect_account:true})

    storeConnectAcctToken({ 
      plaid_token:public_token, 
      account_ID:metadata.account_id,
      user_email:this.state.user_email,
      first_name:this.state.first_name,
      last_name:this.state.last_name,
      dob_day:this.state.dob_day,
      dob_month:this.state.dob_month,
      dob_year:this.state.dob_year,
      address_line1:this.state.address_line1,
      address_city:this.state.address_city,
      address_postal_code:this.state.address_postal_code,
      address_state:this.state.address_state,
      country:this.state.country,
      ssn_last_4:this.state.ssn_last_4,
    })
    .then((response) => {

     console.log("storeConnectAcctToken", response)

     if (response.success) {
      this.setState({has_connect_account:true})
      console.log("D success")
     } else {
      console.log("D fail", response, typeof(response))
      this.setState({
        has_connect_account:false,
        account_error:String(response),
      })
     }
     
    })
  }

// this.state.has_customer_id &&

  public renderTermsOfServiceDeposit(): JSX.Element {

        const { first_name, 
            last_name,
            dob_day,
            dob_month,
            dob_year,
            birthday_string,
            address_line1,
            address_city,
            address_postal_code,
            address_state,
            country,
            country_str,
            ssn_last_4,
            isLoading } = this.state;

    var error_message;

    if (this.state.account_error) {
      error_message = <div>{this.state.account_error}</div>
    } else {
     error_message = <div></div>
    } 

    if (this.state.has_connect_account) {

      return (
              <div> 
                <button 
                onClick={()=>this.setState({has_connect_account:false})}
                className="btn-primary create-balance-btn"
                > Your account is set up to receive payments. Update account for receiving payments
                </button>
              </div>
              );

    } else {

      return (

             <div className="form-group">

                <h3> Terms of Service </h3>
                To make Balance both parties must submit their account information. 
                Your account will not be charged until the conclusion of an active 
                Balance contract and Balance contracts can only be made active with 
                your approval by clicking the confirm button under Current Balances. 
                <br/><br/>

                Payment processing services for Balancers on Balance are provided by 
                Stripe and are the subject to the 
                <Link to="https://stripe.com/us/connect-account/legal"> 
                 Stripe Connected Account Agreement </Link>
                , which includes 
                <Link to="https://stripe.com/us/legal"> Stripe Terms of Service. </Link>
                By agreeing to  these terms or continuing to 
                operate as a Balancer on Balancer, you agree to be 
                bound by the Stripe Services Agreement, as the same may be modified by 
                Stripe from time to time. As a condition of Balance enabling 
                payment processing services through Stripe, you agree to provide 
                Balance accurate and complete information about you or your 
                business, and you authorize Balance to share it and transaction 
                information related to your use of the payment processing services 
                provided by Stripe. 
                <br/><br/>

              <br/><br/>
              <h3> Setup your account to receive payments (seller setup)</h3>
              <br/><br/>

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

                    //console.log(e.target.value)
                    this.setState({ birthday_string: e.target.value }, () => {

                      var str_array = this.state.birthday_string.split("/");
                      
                      if (str_array.length == 3) {
                        var day = parseInt(str_array[1], 10)
                        var month = parseInt(str_array[0], 10)
                        var year = parseInt(str_array[2], 10)
                        
                        if (day > 0 && day < 32 && month > 0 && month < 13 && 
                            year > 0 && year < new Date().getFullYear()) {
                            //console.log("array", day, month, year); 
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

                <label className="label-default"> street address </label>
                <input
                  className="input-default full-width"
                  type="text"
                  placeholder="123 Fair Lane, Unit A "
                  value={address_line1 || ""}
                  onChange={e => {
                    this.setState({ address_line1: e.target.value })
                  }}
                />

                <label className="label-default"> city </label>
                <input
                  className="input-default full-width"
                  type="text"
                  placeholder="Carson City"
                  value={address_city || ""}
                  onChange={e => {
                    this.setState({ address_city: e.target.value })
                  }}
                />

                <label className="label-default"> Postal Code </label>
                <input
                  className="input-default full-width"
                  type="text"
                  placeholder="54321"
                  value={address_postal_code || ""}
                  onChange={e => {
                    this.setState({ address_postal_code: e.target.value })
                  }}
                />

                <label className="label-default"> Last 4 digits of your social security number </label>
                <input
                  className="input-default full-width"
                  type="text"
                  placeholder="4321"
                  value={ssn_last_4 || ""}
                  onChange={e => {
                    this.setState({ssn_last_4: e.target.value})
                  }}
                />

                <label className="label-default"> State, county, province, or region </label>
                <input
                  className="input-default full-width"
                  type="text"
                  placeholder="CA"
                  value={address_state || ''}
                  onChange={e => {
                    this.setState({ address_state: e.target.value })
                  }}
                />

                <label className="label-default"> country (2 character country code, US for United States) </label>
                <input
                  className="input-default full-width"
                  type="text"
                  placeholder="US"
                  value={country_str || ""}
                  onChange={e => {

                    this.setState({ country_str: e.target.value }, () => {

                      if (this.state.country_str && this.state.country_str.length == 2) {

                        this.setState({ country: this.state.country_str }, () => {
                          console.log('country ', this.state.country_str)
                        })
                      }
                    })
                  }}
                />
              
              <div>
                <h3>{error_message}</h3>
              </div>

              <PlaidLink
                className="btn-primary create-balance-btn"
                style={{backgroundColor: '#19c8b5'}}
                clientName="Balance"
                env="sandbox" // "development" //
                product={["auth", "transactions"]}
                publicKey={this.state.pldpublickey}
                onExit={this.handleOnExit}
                onSuccess={this.handleDepositSuccess}
              >
                Setup your bank account to receive payments, 
                agree to the terms of service and submit your
                user information. 
              </PlaidLink>
            </div>
      );
    }
  }

  public renderSubmitCreditCard(): JSX.Element {

    if (this.state.has_customer_id) {

      return (
          <div> 
            <button 
            onClick={()=>this.setState({has_customer_id:false})}
            className="btn-primary create-balance-btn"
            > Your account is set up to send payments. Update account for sending payments
            </button>
          </div>
      );
      } else {

        return (
            <div>
              <br/><br/>
              <h3> Setup your payment method (buyer setup) </h3>
              <br/><br/>
              <StripeProvider 
                apiKey={this.state.strppublickey}
              >
                  <Elements>
                    <CheckoutForm onSubmitCard={this.handleCreditCard} />
                  </Elements>
              </StripeProvider>
              <br/><br/>
            </div>
        )

      }
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

          {this.renderSubmitCreditCard()}

            <section className="create-balance-container">

              {this.renderTermsOfServiceDeposit()}

            </section>

          </div>
        </main>
      </div>
    );
  }
}

export default MyAccount;


/*

//if (!isLoading && data.length > 0 && user_email) {

  this.handleSendSuccess = this.handleSendSuccess.bind(this)

  public renderSendPlaid(): JSX.Element {
    
    return (
      <div>
        <PlaidLink
          className="btn-primary create-balance-btn"
          style={{backgroundColor: '#19c8b5'}}
          clientName="Balance"
          env="sandbox" // "development"//
          product={["auth", "transactions"]}
          publicKey={this.state.pldpublickey}
          onExit={this.handleOnExit}
          onSuccess={this.handleSendSuccess}
        >
          Tell Balance which bank account to send payments from and agree with terms of service
        </PlaidLink>
      </div>
    );
  }

  handleSendSuccess(public_token, metadata) {
    
    console.log('SEND')
    console.log('public_token: ' + public_token);
    console.log('account ID: ' + metadata.account_id);

    this.setState({has_customer_id:true})

    storeCustomerID({ plaid_token:public_token,
                      account_ID:metadata.account_id,
                      user_email:this.state.user_email,
                      first_name:this.state.first_name,
                      last_name:this.state.last_name,
                      dob_day:this.state.dob_day,
                      dob_month:this.state.dob_month,
                      dob_year:this.state.dob_year,
                      address_line1:this.state.address_line1,
                      address_city:this.state.address_city,
                      address_postal_code:this.state.address_postal_code,
                      address_state:this.state.address_state,
                      country:this.state.country,
                      ssn_last_4:this.state.ssn_last_4,
                    })
    .then((response) => {
     console.log("storeCustomerID", response)
     if (response.success) {
      this.setState({has_customer_id:true})
      console.log("S success")
     } else {
      this.setState({has_customer_id:false})
      console.log("S fail")
     }
     
    })
    
  }


{ this.renderSendPlaid() }

*/
