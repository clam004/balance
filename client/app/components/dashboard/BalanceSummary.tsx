import * as React from 'react';
import { BalanceData } from './Elements';
import { RouteComponentProps, Link } from 'react-router-dom';
import { get_balance_data, balanceDelete } from '../../helpers/usersbalances';
import { logout, getUserData, isLoggedIn } from '../../helpers/auth';
import './Dashboard.less';
import * as moment from 'moment';
import { SideNav } from '../nav';

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
  balance_id: number,
  user_id:number,
  has_connect_account:boolean,
  has_customer_id:boolean,
  user_email:string,
}

class BalanceSummary extends React.Component<DashboardProps & RouteComponentProps<{}>, DashboardState> {


  constructor(props: DashboardProps & RouteComponentProps<{}>) {

    super(props);

    this.state = {
      balance_data: null,
      isLoading: false,
      balance_id: null,
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

    var balance_id = JSON.parse(localStorage.getItem("balance_id"));

    get_balance_data({balance_id:balance_id})
    .then(balance_data => {
    this.setState({isLoading: false})
    this.setState({balance_data:balance_data[0]})
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

  approveBalance(balance_data: any) {

    const { history } = this.props;

    if (this.state.user_id == balance_data.buyer_id) {
      history.push('/buying-balances')
    } else if (this.state.user_id == balance_data.seller_id) {
      history.push('/selling-balances')
    }

  }

  handleUpdateBalance(updates: any) {
    //const { balance } = this.state;
    //this.setState({
      //balance: merge({}, balance, updates),
    //});
  }

  render() {
    
    var user_email = this.state.user_email 

    var user_alias = "You"

    if (user_email) {
      user_alias = user_email.substr(0, user_email.indexOf('@')); 
    }
    
    const { balance_data, isLoading } = this.state;

    if (isLoading || balance_data == null) { 

      console.log('Loading...', balance_data)

      return (<h3> Loading ... </h3>)

    } else {
 
      console.log('Loaded:', balance_data)

      return (

        <div className="dashboard-container">

          <SideNav />

          <main className="main-container">
            <div className="main-header">
              <img className="main-logo" src="assets/logo-white.svg" />
              <h3> Title: {balance_data.title} </h3>
            </div>

               <BalanceData 
                balance_data={balance_data} 
                onUpdate={this.handleUpdateBalance.bind(this)}
               />

              <div>

                  <button className="btn-primary create-balance-btn"
                    onClick={() => {
                      localStorage.setItem("balance_id",null);
                      this.approveBalance(balance_data); 
                    }}
                  >
                    <img src="assets/btn-logo-1.svg" />
                    see balance among current balances 
                  </button>


                <Link to="/create">
                  <button className="btn-primary create-balance-btn"
                    onClick={() => {
                      console.log("clicked edit balance")
                    }}       
                  >
                    <img src="assets/btn-logo-1.svg" />
                    Edit Balance
                  </button>
                </Link>

                <Link to="/myaccount">
                  <button className="btn-primary create-balance-btn"
                    onClick={() => {
                      balanceDelete(balance_data);
                      console.log("clicked cancel balance")
                      localStorage.setItem("balance_id",null); 
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

export default BalanceSummary
export { BalanceSummary, Balance_Data};


