import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';

import {  getBalances, 
          toggleConfirm, 
          toggleComplete, 
          balanceDone,
          balanceDelete } from '../../helpers/usersbalances'; 

import { logout, getUserData, isLoggedIn } from '../../helpers/auth';

import { HttpResponse, get, post, del } from '../../helpers/http';
import './Dashboard.less';
import * as moment from 'moment';
import PlaidLink from 'react-plaid-link'

const { PLDPUBLISHABLE_KEY } = require('./pldconfig');

const SideNav = () => {

  return (
    <nav className="side-nav-container">
      <div className="side-nav-header">
        <img className="side-nav-logo" src="assets/logo-green.svg" />
        <h3><Link to="/">Balance</Link></h3>
      </div>
      <ul className="side-nav-list">
        <li className="nav-item active">
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
    completed:boolean,
    buyer_confirmed:boolean,
    seller_confirmed:boolean,
    agreement_status:string,
    buyer_id:number,
    seller_id:number,
    created_at:string,
    updated_at:string,
    due_date:string,
    id:number 
}

interface DashboardState {
  data:  Array<IBalance>, // Array<HttpResponse>, //
  isLoading: boolean,
  pldpublickey:string,
  user_id:number,
  has_connect_account:boolean,
  has_customer_id:boolean,
  user_email:string,
}

class Dashboard extends React.Component<DashboardProps & RouteComponentProps<{}>, DashboardState> {

  constructor(props: DashboardProps & RouteComponentProps<{}>) {

    super(props);

    this.state = {
      data: [],
      isLoading: false,
      pldpublickey:PLDPUBLISHABLE_KEY,
      user_id:null,
      has_connect_account:null,
      has_customer_id:null,
      user_email:null,
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

    getBalances()
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
    balance[0].seller_confirmed = !balance[0].seller_confirmed; 
    let balances: IBalance[] = [...this.state.data];
    balances.splice(index, 0, balance[0]);
    this.setState({data:balances});
  }

  public toggleCompleteState(index: number): void {
    let balance: IBalance[] = this.state.data.splice(index,1); 
    balance[0].completed = !balance[0].completed; 
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

    var user_id = this.state.user_id
    
    return this.state.data.map((balance, array_index) => {

        if (balance.seller_id == user_id && 
            !balance.seller_confirmed) {

          var agreement_button = (

             <div>

              <br/><br/>
              <button className="btn-primary"
              onClick={() => {
                toggleConfirm({id:balance.id, confirm:balance.seller_confirmed});
                this.toggleConfirmState(array_index);
              }}
              >
               {balance.seller_confirmed? "undo confirm" : "confirm you agree with contract terms" }
              </button>

              <br/><br/>
              <button className="btn-primary"
              onClick={() => {
                balanceDelete({id:balance.id});
                this.completeBalance(array_index);
              }}
              >
               Disgree with terms remove contract 
              </button>

             </div>

          )

        } else if (balance.seller_id == user_id && 
                   balance.seller_confirmed) {

          var agreement_button = (

             <div>
             <br/><br/>
              <button className="btn-primary"
              onClick={() => {
                toggleConfirm({id:balance.id, confirm:balance.seller_confirmed});
                this.toggleConfirmState(array_index);
              }}
              >
               {balance.seller_confirmed? "undo confirm" : "confirm you agree with contract terms" }
              </button>
              </div>

          ) 

          var completed_button = (
              <div>
              <br/><br/>
              <button className="btn-primary"
              onClick={() => {
                toggleComplete({id:balance.id, completed:balance.completed});
                this.toggleCompleteState(array_index);
              }}
              >
               {balance.completed? "undo complete" : "indicate that balance is completed"}
              </button>
              </div>
          )


        } else if (balance.buyer_id == user_id && balance.completed && 
                   balance.buyer_confirmed && balance.seller_confirmed) { 

          var completed_button = (
              <div>
              <br/><br/>
              <button className="btn-primary"
              onClick={() => {
                balanceDone({balance});
                this.completeBalance(array_index);
              }}
              >
               balance delivered complete contract 
              </button>
              </div>
          )
        } else {
          var agreement_button = <span></span>
          var completed_button = <span></span>
        }


        return (
          <section key={balance.id} className="balance-section">
            <div className="balance-created-date"> Created {moment(balance.created_at, moment.ISO_8601).fromNow()} </div>

            <div className="balance-cards-container">
              <div className="balance-participants-card">
                <div className="balance-participant-container">
                  <div className="balance-participant-photo">{}</div>

                  <div className="balance-participant-details">
                    <div className="balance-stake">
                      {balance.buyer_email} has staked ${balance.buyer_stake_amount}
                    </div>
                    <div className="balance-goods">{balance.buyer_obligation}</div>
                  </div>
                </div>

                <div className="balance-participant-container">
                  <div className="balance-participant-photo">{}</div>

                  <div className="balance-participant-details">
                    <div className="balance-stake">
                      {balance.seller_email} has staked ${balance.seller_stake_amount}
                    </div>
                    <div className="balance-goods">{balance.seller_obligation}</div>
                  </div>
                </div>
              </div>

              <div className="balance-agreement-container">
                <h5 className="balance-agreement-header">{balance.title}</h5>

                <div className="balance-agreement-text">
                  {balance.balance_description} {' '}
                </div>
                <div className="balance-agreement-text">
                  <span className="text-bold">due {' '} {moment(balance.due_date, moment.ISO_8601).fromNow()}</span>
                </div>
                <div className="balance-agreement-price">${balance.balance_price}</div>
                
                <div className="balance-agreement-text">
                  <label> 
                  <h5 className="balance-agreement-header">{balance.seller_confirmed? " seller has agreed to terms" : " awaiting agreement from seller " }</h5>
                  {agreement_button}
                  </label>
                </div>
                  
                <div className="balance-agreement-text">
                  <label>
                  <h5 className="balance-agreement-header">{balance.completed? "seller indicates balance completed" : "balance not completed"}</h5>
                  {completed_button}
                  </label>
                </div>

              </div>
            </div>
          </section>
        );
    });
  }

  public renderAccount(): JSX.Element {

    if (this.state.has_connect_account && this.state.has_customer_id && this.state.data.length >0 ) {
      return (<div> </div>);
    } else if (!this.state.has_connect_account || !this.state.has_customer_id) {
      return (
        <div>
          Please go to My Account to finish setting up your account as a buyer, seller or both! 
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

export default Dashboard;





/*

//if (!isLoading && data.length > 0 && user_email) {

var example_balance = {
  title:'Example Balance',
  balance_description:' Toro the Solar Panel technian has agreed to install 3 solar panels on Josh’s roof',
  buyer_obligation:'Have a roof and let in Toro on time',
  seller_obligation:'To install 3 solar panels',
  buyer_email: 'Josh@balance.com',
  seller_email:'Toro@balance.com',
  buyer_stake_amount:800,
  seller_stake_amount:400,
  balance_price:2000,
  completed:false,
  buyer_confirmed:true,
  seller_confirmed:true,
  agreement_status:"confirm",
  buyer_id:1,
  seller_id:2,
  created_at: "2018-10-25 12:52:55-07", 
  updated_at: "2018-10-25 12:52:55-07", 
  due_date: "2018-10-25 12:52:55-07", 
  id:0
  }


const BalanceDetails = ({ balance }: { balance: IBalance}) => {

  return (
        <section className="balance-section">
          <div className="balance-created-date"> Created 2 days ago </div>

          <div className="balance-cards-container">
            <div className="balance-participants-card">
              <div className="balance-participant-container">
                <div className="balance-participant-photo">{}</div>

                <div className="balance-participant-details">
                  <div className="balance-stake">
                    {balance.buyer_email} has staked ${balance.buyer_stake_amount}
                  </div>
                  <div className="balance-goods">{balance.buyer_obligation}</div>
                </div>
              </div>

              <div className="balance-participant-container">
                <div className="balance-participant-photo">{}</div>

                <div className="balance-participant-details">
                  <div className="balance-stake">
                    {balance.seller_email} has staked ${balance.seller_stake_amount}
                  </div>
                  <div className="balance-goods">{balance.seller_obligation}</div>
                </div>
              </div>
            </div>

            <div className="balance-agreement-container">
              <h5 className="balance-agreement-header">Example Balance Agreement</h5>

              <div className="balance-agreement-text">
                {balance.balance_description} due {' '}
                <span className="text-bold"> in 10 days </span>
              </div>
              <div className="balance-agreement-price">${balance.balance_price}</div>

            </div>
          </div>
        </section>
  );
};

      return (

        <div className="dashboard-container">
          <SideNav />
          <main className="main-container">
            <div className="main-header">
              <img className="main-logo" src="assets/logo-white.svg" />
              <h3>Current Balances for {user_alias} </h3>
            </div>

              { this.renderDepositPlaid() }
              { this.renderSendPlaid() }

              <br/>
            <div className="balances-container">

            <BalanceDetails 
              balance = {example_balance}
            />

              <section className="create-balance-container">
                <Link to="/create">
                  <button className="btn-primary create-balance-btn">
                    <img src="assets/btn-logo-1.svg" />
                    Create Balance
                  </button>
                </Link>
              </section>
            </div>
          </main>
        </div>
      );



    // TODO: try out styled components
    //if (Array.isArray(data) && data.length >0) {

    //var user_id = JSON.parse(localStorage.getItem("user_id"));

    const BAL_API_URL = API_URL +'/api/balances/'+localStorage.getItem('user_id');
    fetch(BAL_API_URL)
      .then(response => response.json())
      .then(data => this.setState( {data:data, isLoading: false} ));
    */

    /*  
    const BAL_API_URL = API_URL +'/api/balances/'+localStorage.getItem('user_id');
    fetch(BAL_API_URL)
      .then(response => response.json())
      .then(data => {
      console.log(typeof(data));
      this.setState({data:data});
      this.setState({isLoading: false}); 
      });



    */
