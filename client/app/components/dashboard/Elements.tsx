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

export {SideNav, BalanceData};

/*


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


*/

