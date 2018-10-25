import * as React from 'react';
import { SideNav, BalanceData } from './Elements'
import { RouteComponentProps, Link } from 'react-router-dom';
import { get_balance_data, balanceDelete } from '../../helpers/transactions';
import './Dashboard.less';
import * as moment from 'moment';

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

  handleUpdateBalance(updates: any) {
    //const { balance } = this.state;
    // console.log(updates)
    // TODO: connect to API
    //this.setState({
      //balance: merge({}, balance, updates),
      //isEdit: true
    //});
  }

  render() {
    
    var user_email = JSON.parse(localStorage.getItem("user_email"));
    var user_alias = user_email.substr(0, user_email.indexOf('@')); 
    
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
                <Link to="/dashboard">
                  <button className="btn-primary create-balance-btn">
                    <img src="assets/btn-logo-1.svg" />
                    Confirm Balance
                  </button>
                </Link>

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

export default BalanceSummary
export { BalanceSummary, Balance_Data};


