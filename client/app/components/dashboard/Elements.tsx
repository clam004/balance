import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import './Dashboard.less';
import { Balance_Data } from './BalanceSummary';
import * as moment from 'moment';

interface Props {
  balance_data: Balance_Data
  onUpdate: (updates: any) => void;
}

interface State {
  balance_data: Balance_Data
}

class BalanceData extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const { balance_data = {} as Balance_Data } = props;
    this.state = {balance_data:balance_data};
  }

  render () {

    const { balance_data } = this.state;

    return (
      <div>
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
      </div>
    );
  };
};

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

interface CompleteProps {
  balance:IBalance
}

interface CompleteState {

}

class BalanceParticipantDetails extends React.Component<CompleteProps, CompleteState> {

  constructor(props: CompleteProps) {
    super(props);
  }
  

  render() {

    const balance = this.props.balance;
    return (
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
    )
  }
}

export {SideNav, BalanceData, BalanceParticipantDetails};

// export default CompleteBalanceDetails;

/*

interface CompleteProps {

}

interface CompleteState {

}

class CompleteBalanceDetails extends React.Component<CompleteProps, CompleteState> {

  constructor(props: CompleteProps) {
    super(props);
  }

  render () {

    return (


        <div className="new-balance-container"
          style={{ 
          paddingLeft: 0, 
          paddingTop: 120,
          paddingRight: 100,
          }}
        >
        <section className="new-balance-detail-container">

        <h4 className="new-balance-detail-header">Contract Builder</h4>
        {}

          <div className="balance-alert">
            <div className="alert-text text-bold">Your Contract</div>
            <div className="alert-description text-sm">
              Tell Balance 
            </div>
            <div className="alert-action text-sm text-bold">Dismiss</div>
          </div>

          <div className="form-group">
            <label className="label-default">Seller Obligations</label>
            <textarea
              className="input-default full-width"
              rows={3}
              placeholder="responsibilities of receiver of payment"
              //value={seller_obligation || ""}
              //onChange={e => this.setState({ seller_obligation: e.target.value })}
            />
          </div>

          <div className="form-group">
            
            <label className="label-default">Time until payment (from this moment)</label>
            <input
             className="input-default full-width"
            />


          </div>

          <button
            className="btn-primary full-width"
            onClick={() => {
            }}
          >
            <img src="assets/btn-logo-1.svg" style={{ marginRight: 16 }} />
            Save Contract
          </button>

       </section>
       </div>
       

    );

  }

}




        <main className="main-container" 
        >
        </main>
      <div className="new-balance-container">
      <section className="new-balance-box">
      <div style={{ paddingLeft: 16, paddingRight: 16 }}>

        <div className="balance-alert">
          <div className="alert-text text-bold">Hi</div>
          <div className="alert-description text-sm">
            Balance
          </div>
          <div className="alert-action text-sm text-bold">Dismiss</div>
        </div>

        <div className="form-group">
          <label className="label-default">Contract Title</label>
          <input
            className="input-default full-width"
            type="text"
            placeholder="Contract Title"
            //value={title || ""}
            //onChange={e => this.setState({ title: e.target.value })}
          />
        </div>
      </div>
      </section>
      </div>

*/

