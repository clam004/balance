import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { getHistory } from '../../helpers/transactions';
import { logout } from '../../helpers/auth';
import { HttpResponse, get, post, del } from '../../helpers/http';
import './Dashboard.less';
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
          <Link to="/dashboard">Current Balances</Link>
        </li>
        <li className="nav-item active">
          <Link to="/dashboard">History</Link>
        </li>
        <li className="nav-item">
          <Link to="/dashboard">Arbitrations</Link>
        </li>
        <li className="nav-item">
          <Link to="/dashboard">Support</Link>
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
}

class History extends React.Component<DashboardProps, DashboardState> {

  constructor(props: DashboardProps) {

    super(props);

    this.state = {
      data: [],
      isLoading: false,
    }

  }
 
  componentDidMount() {
    
    this.setState({ isLoading: true });

    getHistory()
    .then(data => {
      console.log("data", data);
      if (Array.isArray(data)) {
        this.setState({data:data});
        this.setState({isLoading:false});      
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
    
    var user_email = JSON.parse(localStorage.getItem("user_email"));
    var user_alias = user_email.substr(0, user_email.indexOf('@')); 
    
    // TODO: try out styled components
    //if (Array.isArray(data) && data.length >0) {

    if (!isLoading && data.length > 0) {

      return (

        <div className="dashboard-container">
          <SideNav />
          <main className="main-container">
            <div className="main-header">
              <img className="main-logo" src="assets/logo-white.svg" />
              <h3> Current Balances for {user_alias} </h3>
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
              <h3>Current Balances for {user_alias} </h3>
            </div>

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

    }
  }
}

var example_balance = {
  title:'Example Balance',
  balance_description:`Toro the Solar Panel technian has agreed to install 3 solar panels on Josh’s roof`,
  buyer_obligation:'have a roof and let in toro on time',
  seller_obligation:'To install 3 solar panels',
  buyer_email: 'Josh@balance.com',
  seller_email:'Toro@balance.com',
  buyer_stake_amount:800,
  seller_stake_amount:300,
  balance_price:3600,
  completed:false,
  agreement_confirmed:true,
  agreement_status:"confirm",
  buyer_id:1,
  seller_id:2,
  created_at:'Last Month',
  updated_at:'Last Month',
  due_date:'Next Month',
  id:0
  }


const BalanceDetails = ({ balance }: { balance: IBalance}) => {

  return (
        <section className="balance-section">
          <div className="balance-created-date"> Created {balance.created_at} </div>

          <div className="balance-cards-container">
            <div className="balance-participants-card">
              <div className="balance-participant-container">
                <div className="balance-participant-photo">{/* TODO */}</div>

                <div className="balance-participant-details">
                  <div className="balance-stake">
                    {balance.buyer_email} has staked ${balance.buyer_stake_amount}
                  </div>
                  <div className="balance-goods">{balance.buyer_obligation}</div>
                </div>
              </div>

              <div className="balance-participant-container">
                <div className="balance-participant-photo">{/* TODO */}</div>

                <div className="balance-participant-details">
                  <div className="balance-stake">
                    {balance.seller_email} has staked ${balance.seller_stake_amount}
                  </div>
                  <div className="balance-goods">{balance.seller_obligation}</div>
                </div>
              </div>
            </div>

            <div className="balance-agreement-container">
              <h5 className="balance-agreement-header">Balance Agreement</h5>

              <div className="balance-agreement-text">
                {balance.balance_description} due {' '}
                <span className="text-bold">{moment(balance.due_date, moment.ISO_8601).fromNow()}</span>…
              </div>
              <div className="balance-agreement-price">${balance.balance_price}</div>
              
            </div>
          </div>
        </section>
  );
};

export default History;