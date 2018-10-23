import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { get_balance_data, balanceDelete } from '../../helpers/transactions';
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
        <li className="nav-item">
          <Link to="/history">History</Link>
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

interface DashboardProps extends RouteComponentProps<{}> {}

interface Balance_Data {
  title:string;
  buyer_obligation:string;
  seller_obligation:string;
  balance_description:string;
  buyer_email:string;
  seller_email:string;
  balance_price:number;
  buyer_stake_amount:number;
  seller_stake_amount:number;
  due_date:Date;
}

interface DashboardState {
  balance_data: Balance_Data,
  isLoading: boolean,
  balance_id: number
}

class BalanceSummary extends React.Component<DashboardProps, DashboardState> {


  constructor(props: DashboardProps) {

    super(props);

    this.state = {
      balance_data: null,
      isLoading: false,
      balance_id: null
    }

  }
 
  componentDidMount() {

    this.setState({ isLoading: true });

    var balance_id = JSON.parse(localStorage.getItem("balance_id"));

    get_balance_data({balance_id:balance_id})

      .then(balance_data => {
     
      this.setState({isLoading: false})
      this.setState({balance_data:balance_data[0]})

      }); 

  }

  render() {
    
    var user_email = JSON.parse(localStorage.getItem("user_email"));
    var user_alias = user_email.substr(0, user_email.indexOf('@')); 
    
    const { balance_data, isLoading } = this.state;

    if (isLoading || balance_data == null) { 

      console.log('not yet', balance_data)

      return (<h3> Loading ... </h3>)

    } else {
 
      console.log('now', balance_data)

      return (

        <div className="dashboard-container">
          <SideNav />
          <main className="main-container">
            <div className="main-header">
              <img className="main-logo" src="assets/logo-white.svg" />
              <h3> Title: {balance_data.title} </h3>
            </div>

                      
            <section className="balance-section">
              <div className="balance-created-date"> Buyer Obligation </div>
              <div className="balance-cards-container">
                <div className="balance-summary-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-stake">
                        {balance_data.buyer_obligation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="balance-section">
              <div className="balance-created-date"> Seller Obligation </div>
              <div className="balance-cards-container">
                <div className="balance-summary-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-stake">
                        {balance_data.seller_obligation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="balance-section">
              <div className="balance-created-date"> Additional Details </div>
              <div className="balance-cards-container">
                <div className="balance-summary-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-stake">
                        {balance_data.balance_description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="balance-section">
              <div className="balance-created-date"> Buyer's email </div>
              <div className="balance-cards-container">
                <div className="balance-summary-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-stake">
                        {balance_data.buyer_email}  
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="balance-section">
              <div className="balance-created-date"> Seller's email </div>
              <div className="balance-cards-container">
                <div className="balance-summary-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-stake">
                        {balance_data.seller_email}  
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="balance-section">
              <div className="balance-created-date"> Payment to seller for completed balance</div>
              <div className="balance-cards-container">
                <div className="balance-summary-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-stake">
                        $ {balance_data.balance_price}  
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="balance-section">
              <div className="balance-created-date"> Buyer's stake </div>
              <div className="balance-cards-container">
                <div className="balance-summary-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-stake">
                        $ {balance_data.buyer_stake_amount}  
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="balance-section">
              <div className="balance-created-date"> Seller's stake </div>
              <div className="balance-cards-container">
                <div className="balance-summary-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-stake">
                        $ {balance_data.seller_stake_amount}  
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="balance-section">
              <div className="balance-created-date"> balance due date </div>
              <div className="balance-cards-container">
                <div className="balance-summary-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-stake">
                        {moment(balance_data.due_date).format('LLLL')}  
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

              <div>
                <Link to="/dashboard">
                  <button className="btn-primary create-balance-btn">
                    <img src="assets/btn-logo-1.svg" />
                    Send Balance
                  </button>
                </Link>

                <button className="btn-primary create-balance-btn"
                >
                  <img src="assets/btn-logo-1.svg" />
                  Edit Balance
                </button>

                <Link to="/dashboard">
                  <button className="btn-primary create-balance-btn"
                    onClick={() => {
                      balanceDelete(balance_data);
                      console.log("clicked cancel balance")
                    }}
                  >
                    <img src="assets/btn-logo-1.svg" />
                    Cancel Balance
                  </button>
                </Link>

              </div>
            
          </main>
        </div>
      );
    }
  }
}

export default BalanceSummary;

/*

"YYYY-MM-DDTHH:mm:ss"

      <div className="dashboard-container">
        <SideNav />
        <main className="main-container">
          <div className="main-header">
            <img className="main-logo" src="assets/logo-white.svg" />
            <h3> Review Balance for {user_alias} </h3>
          </div>

                    <b>Title:</b> {balance_data.title}
          <section className="balance-section">
            <div className="balance-created-date"> Text1 </div>

            <div className="balance-cards-container">
              <div className="balance-participants-card">
                <div className="balance-participant-container">
                  <div className="balance-participant-photo">{}</div>

                  <div className="balance-participant-details">
                    <div className="balance-stake">
                      Text2
                    </div>
                    <div className="balance-goods">Text3</div>
                  </div>
                </div>

                <div className="balance-participant-container">
                  <div className="balance-participant-photo">{}</div>

                  <div className="balance-participant-details">
                  
                    <div className="balance-stake">
                      Text5
                    </div>
                    <div className="balance-goods">Text6</div>
                  </div>
                </div>
              </div>

              <div className="balance-agreement-container">
                <h5 className="balance-agreement-header">Text7</h5>

                <div className="balance-agreement-text">
                  Text7
                  <span className="text-bold">Text8</span>
                </div>
                <div className="balance-agreement-price">Text9</div>
                
                <div className="balance-agreement-text">        

                </div>

              </div>
            </div>
          </section>
                    <b>Buyer Obligation:</b> {balance_data.buyer_obligation}

          <section className="create-balance-container">
              <button className="btn-primary create-balance-btn">
                <img src="assets/btn-logo-1.svg" />
                Send Balance
              </button>
          </section>
        </main>
      </div>
*/
