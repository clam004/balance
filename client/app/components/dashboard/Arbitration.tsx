import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { getHistory, getArbitrations } from '../../helpers/usersbalances';
import { logout, getUserData, isLoggedIn } from '../../helpers/auth';
import { HttpResponse, get, post, del } from '../../helpers/http';
import './Dashboard.less';
import * as moment from 'moment';
import { SideNav } from '../nav';

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
    agreement_confirmed:boolean,
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
  user_id:number,
  has_connect_account:boolean,
  has_customer_id:boolean,
  user_email:string,
}

class Arbitration extends React.Component<DashboardProps & RouteComponentProps<{}>, DashboardState> {

  constructor(props: DashboardProps & RouteComponentProps<{}>) {

    super(props);

    this.state = {
      data: [],
      isLoading: false,
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

    getArbitrations()
    .then(data => {
      console.log("data", data);
      if (Array.isArray(data)) {
        this.setState({data:data});
        this.setState({isLoading:false});      
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
        this.setState({user_id:userdata[0].id,
                       has_connect_account:has_connect_account,
                       has_customer_id:has_customer_id,  
                       user_email:userdata[0].email, 
                       isLoading:false}); 
      }
    });

  }

  public renderBalance(): JSX.Element[] {

    var user_id = JSON.parse(localStorage.getItem("user_id"));
    
    return this.state.data.map((balance, array_index) => {

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

              </div>
            </div>
          </section>
        );
    });
  }

  render() {

    const { data, isLoading } = this.state;
    
    var user_email = this.state.user_email 

    var user_alias = "You"

    if (user_email) {
      user_alias = user_email.substr(0, user_email.indexOf('@')); 
    }

    if (!isLoading && data.length > 0) {

      return (

        <div className="dashboard-container">
          <SideNav />
          <main className="main-container">
            <div className="main-header">
              <img className="main-logo" src="assets/logo-white.svg" />
              <h3> Balances in arbitration for {user_alias} </h3>
            </div>

            <div className="balances-container">
        
            {
              this.renderBalance()
            }

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

    } else {

      return (
        <div className="dashboard-container">
          <SideNav />
          <main className="main-container">
            <div className="main-header">
              <img className="main-logo" src="assets/logo-white.svg" />
              <h3>Current Balances in arbitration for {user_alias} </h3>
            </div>

            <div className="balances-container">

            No Balances in Arbitration

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

    }
  }
}

export default Arbitration;