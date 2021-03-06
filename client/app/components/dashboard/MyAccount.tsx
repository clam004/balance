import * as React from 'react';
import * as moment from 'moment';
import './Dashboard.less';

import { RouteComponentProps, Link } from 'react-router-dom';

import { storeConnectAcctToken, 
         storeCustomerID,
         getConnectData } from '../../helpers/transactions';  

import { logout, getUserData, isLoggedIn } from '../../helpers/auth';

import { HttpResponse, get, post, del } from '../../helpers/http';

import PlaidLink from 'react-plaid-link'
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import { SideNav } from '../nav';

const PLAID_PUBLISHABLE_KEY = 'a29874eb5e8cd1e080a3ca90d5183b' //process.env.PLAID_PUBLISHABLE_KEY; //PLAID_PUBLISHABLE_KEY
//console.log('PLAID_PUBLISHABLE_KEY',PLAID_PUBLISHABLE_KEY)
console.log("my account")

interface AccountProps extends RouteComponentProps<{}> {}

interface AccountState {
  isLoading: boolean,
  plaidpublickey:string,
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
  photo_url: string,
  account_error:string,
  verifying:boolean,
}

class MyAccount extends React.Component<AccountProps & RouteComponentProps<{}>, AccountState> {

  constructor(props: AccountProps & RouteComponentProps<{}>) {

    super(props);

    this.state = {
      isLoading:false,
      plaidpublickey:PLAID_PUBLISHABLE_KEY,
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
      photo_url:null,
      account_error:null,
      verifying:false,
    }
    
    this.handleAccountSuccess = this.handleAccountSuccess.bind(this)
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

            if (connect_data.hasAccount) {
              
              console.log("has account")
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

            } else {
              console.log(" error in account")
            }

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
      address_line1,
      address_city,
      address_postal_code,
      address_state,
      country,
      country_str,
      ssn_last_4,
      isLoading,
      verifying,
      account_error, 
    } = this.state;

    var error_message;

    if (account_error) {
      error_message = (<div>{account_error}</div>)
    } else if (verifying) {
      error_message = (<div>Verifying account . . . </div>);
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
      <br/><br/>
      <h3>{error_message}</h3>

    </div>

    );

  }

  public renderTermsOfService(): JSX.Element {

    if (this.state.has_connect_account) {

      return (
        <div>
          You have agreed to the <Link to="https://stripe.com/us/legal"> Stripe Terms of Service. </Link> 
        </div>
      )

    } else {

      return (

       <div className="form-group"> 

          <h3> Terms of Service </h3>

          Before participating in contracts we need you to fill in your 
          information including name and date of birth and select a valid bank
          account.

          This is just for holding each party accountable. 
          Simply entering your information or selecting a bank account 
          will not result in a charge. Your account will only be charged 
          when you give permission, such as by approving a contract and
          transfering stake amount or paying the seller at the conclusion 
          of an active Balance contract. 
          Balance contracts can only be made active with 
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

  public renderUploads(): JSX.Element {

  return (
    <div>
    </div>
  );

  }

  public renderGetAccount(): JSX.Element {

    if (this.state.has_connect_account) {
      return (
        <div> 
          Payment information has been submitted
          <button 
          onClick={()=>this.setState({has_connect_account:false, has_customer_id:false})}
          className="btn-primary create-balance-btn"
          > 
          Change Bank Account
          </button>
        </div>
      )
    } else if (!this.state.has_connect_account) {

      return (

        <PlaidLink
          className="btn-primary create-balance-btn"
          style={{backgroundColor: '#19c8b5'}}
          clientName="BalanceReceive"
          env="sandbox" // "development" //
          product={["auth", "transactions"]}
          publicKey={this.state.plaidpublickey}
          onExit={this.handleOnExit}
          onSuccess={this.handleAccountSuccess}
        >
          Setup your bank account 
        </PlaidLink>
      )
    }
  }

  handleAccountSuccess(public_token, metadata) {
    // Send the public_token and account ID to your app server.
    //console.log('public_token: ' + public_token);
    //console.log('account ID: ' + metadata.account_id);
    //console.log('metadata: ' + metadata);
    this.setState({account_error:"Verifying Credentials, this could take a minute  . . . ", 
                   has_connect_account:true, 
                   verifying:true})

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

      this.setState({has_connect_account:true, 
                     verifying:false,
                     account_error:"Success !!!"
                    })
      console.log("D success")

     } else {

      console.log("D fail", response, typeof(response))
      this.setState({
        has_connect_account:false,
        account_error:String(response),
        verifying:false,
      })

     }
     
    })
  }

  handleOnExit(err, metadata) {
    // handle the case when your user exits Link
    console.log('err: ' + err);
    console.log('metadata: ' + metadata);
    if (err != null) {
      // The user encountered a Plaid API error prior to exiting.
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

              {this.renderUserInfoForm()}

          </div>

          <br/><br/>

          <div className="user-info-container">

              {this.renderTermsOfService()}

          </div>

          <br/><br/>

          <div className="user-info-container">

              {this.renderUploads()}

          </div>

          <section className="create-balance-container">

              {this.renderGetAccount()}

          </section>

        </main>
      </div>
    );
  }
}

export default MyAccount;


/*

  <div>
    Before you set up a balance agreement
    <br/><br/>
    <h3> setup your payment method (buyer setup) </h3>
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
          publicKey={this.state.plaidpublickey}
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
        placeholder={ssn_last_4 || "****"}
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



*/
