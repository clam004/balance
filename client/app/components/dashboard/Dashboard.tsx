import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { API_URL } from '../../helpers/transactions';
import './Dashboard.less';
import * as moment from 'moment';


const SideNav = () => {

  return (
    <nav className="side-nav-container">
      <div className="side-nav-header">
        <img className="side-nav-logo" src="assets/logo-green.svg" />
        <h3>Balance</h3>
      </div>
      <ul className="side-nav-list">
        <li className="nav-item active">
          <Link to="/dashboard">Current Balances</Link>
        </li>
        <li className="nav-item">
          <Link to="/dashboard">History</Link>
        </li>
        <li className="nav-item">
          <Link to="/dashboard">Arbitrations</Link>
        </li>
        <li className="nav-item">
          <Link to="/dashboard">Support</Link>
        </li>
      </ul>
    </nav>
  );
};

interface IBalance {
    title:string,
    balance_description:string,
    buyer_expectation:string,
    seller_deliverable:string,
    buyer_name: string,
    seller_name:string,
    buyer_stake_amount:number,
    seller_stake_amount:number,
    balance_price:number,
    completed:boolean,
    buyer_id:number,
    seller_id:number,
    created_at:string,
    updated_at:string,
    due_date:string,
    id:number 
}

const BalanceDetails = ({ balance }: { balance: IBalance }) => {

  return (
        <section className="balance-section">
          <div className="balance-created-date"> Created {balance.created_at} </div>

          <div className="balance-cards-container">
            <div className="balance-participants-card">
              <div className="balance-participant-container">
                <div className="balance-participant-photo">{/* TODO */}</div>

                <div className="balance-participant-details">
                  <div className="balance-stake">
                    {balance.buyer_name} has staked ${balance.buyer_stake_amount}
                  </div>
                  <div className="balance-goods">{balance.buyer_expectation}</div>
                </div>
              </div>

              <div className="balance-participant-container">
                <div className="balance-participant-photo">{/* TODO */}</div>

                <div className="balance-participant-details">
                  <div className="balance-stake">
                    {balance.seller_name} has staked ${balance.seller_stake_amount}
                  </div>
                  <div className="balance-goods">{balance.seller_deliverable}</div>
                </div>
              </div>
            </div>

            <div className="balance-agreement-container">
              <h5 className="balance-agreement-header">Balance Agreement</h5>

              <div className="balance-agreement-text">
                {balance.balance_description} due {' '}
                <span className="text-bold">{moment(balance.due_date).fromNow()}</span>…
              </div>

              <div className="balance-agreement-price">${balance.balance_price}</div>
            </div>
          </div>
        </section>
  );
};

interface DashboardProps extends RouteComponentProps<{}> {}

interface DashboardState {
  data: Object,
  isLoading: boolean
}

class Dashboard extends React.Component<DashboardProps, DashboardState> {

  constructor(props: DashboardProps) {

    super(props);

    this.state = {
      data: [],
      isLoading: false
    }

  }
 
  componentDidMount() {
    
    this.setState({ isLoading: true });
    const BAL_API_URL = API_URL +'/api/balances/'+localStorage.getItem('user_id');
    console.log(BAL_API_URL)
    fetch(BAL_API_URL)
      .then(response => response.json())
      .then(data => this.setState( {data:data, isLoading: false} ));
  }

  render() {

    const { data, isLoading } = this.state;
    
    var user_email = JSON.parse(localStorage.getItem("user_email"));
    var user_alias = user_email.substr(0, user_email.indexOf('@')); 
    
    // TODO: try out styled components
    if (Array.isArray(data) && data.length >0) {

      console.log(Array.isArray(data))
      const balances_array = data.slice();
      console.log(balances_array)
      for (let balance of balances_array) {
        balance.created_at = moment(balance.created_at).fromNow()//.format('LLL')
        console.log(balance.created_at); // 1, "string", false
      }


      return (
        <div className="dashboard-container">
          <SideNav />
          <main className="main-container">
            <div className="main-header">
              <img className="main-logo" src="assets/logo-white.svg" />
              <h3>Current Balances for {user_alias} </h3>
            </div>

            <div className="balances-container">
        
            {
              balances_array.map((balance,key) =>
              <BalanceDetails
                key={key} 
                balance={balance}
              />
              )
            }

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

export default Dashboard;

var example_balance = {
  title:'Solar Panels',
  balance_description:`Toro the Solar Panel technian has agreed to install 3 solar panels on Josh’s roof`,
  buyer_expectation:'For 3 solar panel installations',
  seller_deliverable:'To install 3 solar panels',
  buyer_name: 'Josh',
  seller_name:'Toro',
  buyer_stake_amount:800,
  seller_stake_amount:300,
  balance_price:3600,
  completed:false,
  buyer_id:1,
  seller_id:2,
  created_at:'Last Month',
  updated_at:'Last Month',
  due_date:'Next Month',
  id:0
  }

/*

            {
              balances_array.map(balance =>
              <BalanceDetails 
                balance={balance}
              />
              )
            }

          {balances_array.map(balance =>
            <BalanceDetails 
              key = 
              balance={balance}
            />
          )}


            {balances_array.forEach(function(value,i) {
              console.log(value);
              return <BalanceDetails 
                       balance={value}
                      />
            })}

    //console.log(this.state.data);
    if (Array.isArray(this.state.data)) {
      const data  = this.state.data;
    }

    const Iuser_id = {user_id:localStorage.getItem('user_id')}

    get_balances(Iuser_id)

    if (Array.isArray(this.state.data)) {
      const bal = this.state.data;
    }
    //const url = 'http://localhost:8000/api/balances/'+localStorage.getItem('user_id');
    //fetch(url).then(response => response.json()).then(data => console.log(data));

              {bals.map(bal =>
            <BalanceDetails balance=bal/>
          )}
*/



