import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { API_URL, toggleConfirm, toggleComplete, balanceDone } from '../../helpers/transactions';
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
              
              <div
              onClick={() => {
                toggleConfirm({id:balance.id, confirm:balance.agreement_confirmed});
              }}
              className="balance-agreement-text"
              >
              <button>
                <h5>{balance.agreement_status}</h5>
              </button>
              </div>

            </div>
          </div>
        </section>
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
  data: Array<IBalance>,
  isLoading: boolean,
}

class Dashboard extends React.Component<DashboardProps, DashboardState> {


  constructor(props: DashboardProps) {

    super(props);

    this.state = {
      data: [],
      isLoading: false,
      //confirmations:[]
    }

  }
 
  componentDidMount() {
    
    this.setState({ isLoading: true });
    const BAL_API_URL = API_URL +'/api/balances/'+localStorage.getItem('user_id');
    //console.log(BAL_API_URL)
    fetch(BAL_API_URL)
      .then(response => response.json())
      .then(data => this.setState( {data:data, isLoading: false} ));

    //const { data, isLoading } = this.state;
    //if (Array.isArray(data) && data.length >0) {}
  }

  public toggleConfirmState(index: number): void {
    let balance: IBalance[] = this.state.data.splice(index,1); // remove this entry
    balance[0].agreement_confirmed = !balance[0].agreement_confirmed; // set it to its opposite
    const balances: IBalance[] = [...this.state.data,...balance]
    this.setState({data:balances});
  }

  public toggleCompleteState(index: number): void {
    let balance: IBalance[] = this.state.data.splice(index,1); // remove this entry
    balance[0].completed = !balance[0].completed; // set it to its opposite
    const balances: IBalance[] = [...this.state.data,...balance]
    this.setState({data:balances});
  }

  public completeBalance(index: number): void {
    let balance: IBalance[] = this.state.data.splice(index,1); // remove this entry
    const balances: IBalance[] = [...this.state.data]
    this.setState({data:balances});
  }

  public renderBalance(): JSX.Element[] {

    console.log(this.state.data)
    var user_id = JSON.parse(localStorage.getItem("user_id"));

    return this.state.data.map((balance,key) => {

        if (balance.seller_id == user_id) {

          var agreement_button = (
            
              <button
              onClick={() => {
                toggleConfirm({id:balance.id, confirm:balance.agreement_confirmed});
                this.toggleConfirmState(key);
              }}
              >
               {balance.agreement_confirmed? "Unconfirm" : "Confirm" }
              </button>
          )

          var completed_button = (

              <button
              onClick={() => {
                toggleComplete({id:balance.id, completed:balance.completed});
                this.toggleCompleteState(key);
              }}
              >
               {balance.completed? "not complete" : "completed"}
              </button>
          )

        } else if (balance.buyer_id == user_id && balance.completed) { 

          var completed_button = (
              <button
              onClick={() => {
                balanceDone({balance});
                this.completeBalance(key);
              }}
              >
               satisfactory balance delivered complete contract 
              </button>
          )
        } else {
          var agreement_button = <span></span>
          var completed_button = <span></span>
        }


        return (
          <section key={key} className="balance-section">
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
                  {balance.balance_description} due {' '}
                  <span className="text-bold">{moment(balance.due_date, moment.ISO_8601).fromNow()}</span>
                </div>
                <div className="balance-agreement-price">${balance.balance_price}</div>
                
                <div className="balance-agreement-text">

                  <h5 className="balance-agreement-header">{balance.agreement_confirmed? "balance confirmed" : "not yet confirmed"}</h5>
                  {agreement_button}
                  <h5 className="balance-agreement-header">{balance.completed? "balance completed" : "balance in progress"}</h5>
                  {completed_button}
                </div>

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
    if (Array.isArray(data) && data.length >0) {

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
              //balances_array.map((balance,key) => {
              //<BalanceDetails key={key} balance={balance}/>
              //})
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







/*

      return this.state.data.map((balance, key) => {

          return (
                <section key={key} className="balance-section">
                  <div className="balance-created-date"> Created {moment(balance.created_at, moment.ISO_8601).fromNow()} </div>

                  <div className="balance-cards-container">
                    <div className="balance-participants-card">
                      <div className="balance-participant-container">
                        <div className="balance-participant-photo">{}</div>

                        <div className="balance-participant-details">
                          <div className="balance-stake">
                            {balance.buyer_name} has staked ${balance.buyer_stake_amount}
                          </div>
                          <div className="balance-goods">{balance.buyer_obligation}</div>
                        </div>
                      </div>

                      <div className="balance-participant-container">
                        <div className="balance-participant-photo">{}</div>

                        <div className="balance-participant-details">
                          <div className="balance-stake">
                            {balance.seller_name} has staked ${balance.seller_stake_amount}
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
                      
                      <div
                      onClick={() => {
                        toggleConfirm({id:balance.id, confirm:balance.agreement_confirmed});
                      }}
                      className="balance-agreement-text"
                      >
                      <button>
                       {balance.agreement_confirmed? "Confirm" : "Unconfirm"}
                      </button>
                      </div>

                    </div>
                  </div>
                </section>
          );
      }




      const balances_array = data.slice();

      for (let balance of balances_array) {

        balance.created_at = moment(balance.created_at, moment.ISO_8601).fromNow() //.format('LLL')
        
        if (balance.agreement_confirmed) {
          balance.agreement_status = <span className="text-bold">confirmed</span>
        } else {
          balance.agreement_status = <span className="text-bold">not confirmed</span>
        }
      }



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



class BalanceCard extend React.Component<> {
  render() {
  return (
        <section className="balance-section">
          <div className="balance-created-date"> Created {this.props.balance.created_at} </div>

          <div className="balance-cards-container">
            <div className="balance-participants-card">
              <div className="balance-participant-container">
                <div className="balance-participant-photo">{}</div>

                <div className="balance-participant-details">
                  <div className="balance-stake">
                    {this.props.balance.buyer_name} has staked ${this.props.balance.buyer_stake_amount}
                  </div>
                  <div className="balance-goods">{this.props.balance.buyer_obligation}</div>
                </div>
              </div>

              <div className="balance-participant-container">
                <div className="balance-participant-photo">{}</div>

                <div className="balance-participant-details">
                  <div className="balance-stake">
                    {this.props.balance.seller_name} has staked ${this.props.balance.seller_stake_amount}
                  </div>
                  <div className="balance-goods">{this.props.balance.seller_obligation}</div>
                </div>
              </div>
            </div>

            <div className="balance-agreement-container">
              <h5 className="balance-agreement-header">Balance Agreement</h5>

              <div className="balance-agreement-text">
                {this.props.balance.balance_description} due {' '}
                <span className="text-bold">{moment(this.props.balance.due_date, moment.ISO_8601).fromNow()}</span>…
              </div>
              <div className="balance-agreement-price">${this.props.balance.balance_price}</div>
              
              <div
              onClick={() => {
                //console.log(API_URL, balance.id)
                //this.toggleConfirm({id:this.props.balance.id});
              }}
              className="balance-agreement-text"
              >
                {this.props.balance.agreement_status}
              </div>

            </div>
          </div>
        </section>
  );
  };
};

*/
