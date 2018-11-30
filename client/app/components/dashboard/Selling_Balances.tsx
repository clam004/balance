import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';

import {  getBalances, 
          toggleSellerApprove, 
          toggleComplete, 
          balanceDone,
          balanceDelete } from '../../helpers/usersbalances'; 

import { buyerPaySeller } from '../../helpers/transactions';

import { logout, getUserData, isLoggedIn } from '../../helpers/auth';
import { HttpResponse, get, post, del } from '../../helpers/http';
import { BalanceParticipantDetails } from './Elements';

import './Dashboard.less';
import '../balance/Balance.less';
import * as moment from 'moment';

const SideNav = () => {
  return (
    <nav className="side-nav-container">
      <div className="side-nav-header">
        <img className="side-nav-logo" src="assets/logo-green.svg" />
        <h3><Link to="/">Balance</Link></h3>
      </div>
      <ul className="side-nav-list">
        <li className="nav-item">
          <Link to="/buying-balances">Buying Balances</Link>
        </li>
        <li className="nav-item active">
          <Link to="/selling-balances">Selling Balances</Link>
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
        <li className="nav-item">
          <Link to="/myaccount">My Account</Link>
        </li>
        <li className="nav-item">
          <Link onClick={() => logout()} to="/">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

interface DashboardProps extends RouteComponentProps<{}> {}

interface IBalance {
  title:string,
  balance_description:string,
  buyer_obligation:string,
  seller_obligation:string,
  buyer_email: string,
  seller_email:string,
  buyer_stake_amount:number,
  seller_stake_amount:number,
  balance_price:number,
  buyer_indicates_delivered:boolean,
  seller_indicates_delivered:boolean,
  buyer_approves_contract:boolean,
  seller_approves_contract:boolean,
  agreement_status:string,
  buyer_id:number,
  seller_id:number,
  created_at:string,
  updated_at:string,
  due_date:string,
  id:number 
}

interface DashboardState {
  data: Array<IBalance>, 
  isLoading: boolean,
  user_id:number,
  has_connect_account:boolean,
  has_customer_id:boolean,
  user_email:string,
  balance_array_index_buyer_says_complete:number,
  balance_array_index_buyer_says_arbitration:number,
}

class Selling_Balances extends React.Component<DashboardProps & RouteComponentProps<{}>, DashboardState> {

  constructor(props: DashboardProps & RouteComponentProps<{}>) {

    super(props);

    this.state = {
      data: [],
      isLoading: false,
      user_id:null,
      has_connect_account:null,
      has_customer_id:null,
      user_email:null,
      balance_array_index_buyer_says_complete:null,
      balance_array_index_buyer_says_arbitration:null,
    }

  }
 
  componentDidMount() {

    const { history } = this.props;
  
    isLoggedIn()
    .then((res)=>{
      if (!res.is_logged_in) {
        history.push('/login');
      }
    })
    
    this.setState({ isLoading: true });

    getBalances({buyer_or_seller_id:"seller_id"})
    .then(data => {
      console.log("data",data);
      if (Array.isArray(data)) {
        this.setState({data:data});     
      }
    });
    
    getUserData()
    .then(userdata => {  
      if (userdata) {
        console.log("userdata", userdata[0]);
        let has_connect_account = false;
        let has_customer_id = false;
        if (userdata[0].stripe_connect_account_token) {
          has_connect_account = true;
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

  public toggleConfirmState(index: number): void {
    let balance: IBalance[] = this.state.data.splice(index,1); 
    balance[0].seller_approves_contract = !balance[0].seller_approves_contract; 
    let balances: IBalance[] = [...this.state.data];
    balances.splice(index, 0, balance[0]);
    this.setState({data:balances});
  }

  public toggleSellerSaysCompleteState(index: number): void {
    let balance: IBalance[] = this.state.data.splice(index,1); 
    balance[0].seller_indicates_delivered = !balance[0].seller_indicates_delivered; 
    let balances: IBalance[] = [...this.state.data];
    balances.splice(index, 0, balance[0]);
    this.setState({data:balances});
  }

  public completeBalance(index: number): void {
    let balance: IBalance[] = this.state.data.splice(index,1); 
    const balances: IBalance[] = [...this.state.data]
    this.setState({data:balances});
  }

  public renderBalance(): JSX.Element[] {

    var participant_or_finish;
    
    return this.state.data.map((balance, array_index) => {

      // Decides what goes into the left part of the balance card 

      if (balance.id == this.state.balance_array_index_buyer_says_complete) {

        participant_or_finish = (

          // Finish State

          <div key={balance.id} className="balance-participants-card">
            <div className="balance-participant-container">
              <div className="balance-participant-details">
                <div className="balance-goods">
                 Buy clicking Finish Balance you agree that the seller has 
                 fullfilled their part of the agreement. This will bring 
                 the balance to a conclusion and the agreed upon price will
                 be transfered from your credit card or bank account 
                 to the sellers account. 
                </div>
              </div>
            </div>

            <div className="balance-participant-container">
              <div className="balance-participant-details">
                <div className="balance-goods">
                  <button className="btn-primary"
                    onClick={() => {
                      balanceDone({balance}); // moves balance to history so buyer can't double pay. 
                      buyerPaySeller({balance});
                      this.completeBalance(array_index);
                    }}
                  >
                   Finish Balance
                  </button>
                </div>
              </div>
            </div>
          </div>

        )

      } else if (balance.id == this.state.balance_array_index_buyer_says_arbitration) {

        participant_or_finish = (

          <div key={balance.id} className="balance-participants-card">
            <div className="balance-participant-container">
              <div className="balance-participant-details">
                <div className="balance-goods">
                  Arbitration is only for cases in which an agreement cannot be reached between the buyer and seller.
                  We encourage you to start a discussion by email that may result in the Balance being completed 
                  before moving to arbitration. Save those email for use in arbitration.
                  Once the Balance is moved to arbitration, the 20% arbitration fee
                  will be collected by Balance. 
                </div>
              </div>
            </div>

            <div className="balance-participant-container">
              <div className="balance-participant-details">
                <div className="balance-goods">
                  <button className="btn-primary"
                    onClick={() => {

                      this.completeBalance(array_index);
                    }}
                  >
                   Move Balance to Arbitration 
                  </button>
                </div>
              </div>
            </div>
          </div>

        )

      } else {

        // display each parties obligations and stakes 

        participant_or_finish = <BalanceParticipantDetails balance={balance} />

      }  

      // decide what goes under the price on the right side of the balance, use to be:agreement_button and completed_button
      // the two sections can be placed inside <div className="balance-agreement-text"> </div>

      var user_id = this.state.user_id;
      var lower_right_buttons;

      //////////////// SELLER's VIEW ///////////////////
      // Seller's View: Buyer has just created the balance and this is the first time the seller is seeing it, balance.seller_approves_contract
      // = null denotes they neither agree nor disagree, the decision has to be made. 
      // TODO: there needs to be a confirm state to remind the seller that if they confirm, the balance will go into active mode
      // which is a state that can only go to completion and arbitration and can only be modified with agreement with both parties.

      if (balance.seller_approves_contract == null && balance.buyer_approves_contract == true &&
          balance.buyer_indicates_delivered == false && balance.seller_indicates_delivered == false) {

        lower_right_buttons = (

          <div className="balance-agreement-text">

            <label> 
              <h5 className="balance-agreement-header">
              {balance.buyer_email} {' '} has proposed this balance. 
              Please indicate you agree with these terms, propose edits
              or delete this balance. Once confirmed the balance will be active. 
              </h5>
            </label>

            <button className="btn-primary"
              onClick={() => {
                // TODO: differentiate seller approve and buyer approve 
                toggleSellerApprove({id:balance.id, seller_approves_contract:balance.seller_approves_contract});
                this.toggleConfirmState(array_index);
              }}
            >
             confirm you agree with terms
            </button>

            <button className="btn-primary"
              onClick={() => {
                // TODO: change balance state to seller_approves_contract=false from seller_approves_contract=null 
                // balanceDelete({id:balance.id});
                // this.completeBalance(array_index);
              }}
            >
             propose edit to the balance  
            </button>

            <br/><br/>

            <button className="btn-primary"
              onClick={() => {
                // TODO: change balance state to seller_approves_contract=false from seller_approves_contract=null 
                // balanceDelete({id:balance.id});
                //this.completeBalance(array_index);
              }}
            >
             delete balance 
            </button>

          </div>
        )

      // Seller's View: Seller saw balance for the first time and agreed with the terms, making balance.seller_approves_contract == true 
      // now it is time to do the work in the contract, for now we have decided to have the rejection button disappear. 
      // During the process of working on the balance the seller cen decide to propose edits or indicate completed 

      } else if (balance.seller_approves_contract == true && balance.buyer_approves_contract == true &&
                 balance.buyer_indicates_delivered == false && balance.seller_indicates_delivered == false)  {

        lower_right_buttons = (

          <div className="balance-agreement-text">

            <label> 
              <h5 className="balance-agreement-header">
               You have agreed to complete this balance for {balance.buyer_email}
              </h5>
            </label>

            <button className="btn-primary"
              onClick={() => {
                // toggleConfirm({id:balance.id, confirm:balance.seller_approves_contract});
                // this.toggleConfirmState(array_index);
              }}
            >
             propose edit to the balance 
            </button>

            <br/><br/>

            <button className="btn-primary"
              onClick={() => {
                // toggleComplete({id:balance.id, completed:balance.completed});
                // this.toggleCompleteState(array_index);
              }}
            >
             indicate balance completed & delivered
            </button>

          </div>
        )

      // Seller's View: Seller has indicated they have completed and delivered the balance and is waiting
      // for the Buyer to indicate they have received a completed balance thereby complteing the balance, 
      // we leave open the option of reverting back to the balance.seller_indicates_delivered == false state
      // but when in the state 

      } else if (balance.seller_approves_contract == true && balance.buyer_approves_contract == true &&
                 balance.buyer_indicates_delivered == false && balance.seller_indicates_delivered == true)  {
  
        lower_right_buttons = (

          <div className="balance-agreement-text">

            <label> 
               You indicated the balance has been completed and delivered. 
               Waiting for {balance.buyer_email} to confirm a completed balance was received.
               Until they confirm, you have the option to undo. 
            </label>

            <button className="btn-primary"
              onClick={() => {
                toggleComplete({id:balance.id, 
                                completed_boolean:balance.seller_indicates_delivered, 
                                seller_or_buyer:'seller'});
                this.toggleSellerSaysCompleteState(array_index);
              }}
            >
             undo completed
            </button>

          </div>
        )
      }
      
      // put together balance, participant_or_finish, agreement_button, completed_button 

      return (

        <section key={balance.id} className="balance-section">
            <div className="balance-created-date"> Created {moment(balance.created_at, moment.ISO_8601).fromNow()} </div>
          <div className="balance-cards-container">
            {participant_or_finish}
          <div className="balance-agreement-container">



              <h5 className="balance-agreement-header">{balance.title}</h5>
              <div className="balance-agreement-text">
                {balance.balance_description} {' '}
              </div>
              <div className="balance-agreement-text">
                <span className="text-bold">due {' '} {moment(balance.due_date, moment.ISO_8601).fromNow()}</span>
              </div>
              <div className="balance-agreement-price">${balance.balance_price}</div>
              
              {lower_right_buttons}    

          </div>
          </div>
        </section>
      );

    }); // end of this.state.data.map((balance, array_index)
  }

  public renderAccount(): JSX.Element {

    if (this.state.has_connect_account && this.state.has_customer_id && this.state.data.length >0 ) {
      return (<div> </div>);
    } else if (!this.state.has_connect_account || !this.state.has_customer_id) {
      return (
        <div>
          Before starting a balance please go to My Account to set up your account  
        </div>
      );
    } else if (this.state.data.length == 0) {
      return (<div> No active or pending balances </div>);
    }
  }

  render() {

    console.log('state at render ', this.state)

    const { data, isLoading} = this.state;
    
    var user_email = this.state.user_email 

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
            <h3> Current Balances for {user_alias} </h3>
          </div>

            { this.renderAccount() }

          <br/>
          <div className="balances-container">
      
            { this.renderBalance() }

            <section className="create-balance-container">
              <Link to="/create">
                <button 
                 className="btn-primary create-balance-btn"
                 onClick={() => {
                  localStorage.setItem("balance_id",null); 
                 }}
                >
                  <img src="assets/btn-logo-1.svg" />
                  Create Balance
                </button>
              </Link>
            </section>
          </div>
        </main>

      </div>
    );
  }
}

export default Selling_Balances;

/*

*/
