import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Dashboard.less';

const SideNav = () => {
  return (
    <nav className="side-nav-container">
      <div className="side-nav-header">
        <img className="side-nav-logo" src="assets/logo-green.svg" />
        <h3>Balance</h3>
      </div>

      <ul className="side-nav-list">
        <li className="nav-item active">
          <a href="/dashboard">Current Balances</a>
        </li>
        <li className="nav-item">
          <a href="/dashboard">History</a>
        </li>
        <li className="nav-item">
          <a href="/dashboard">Arbitrations</a>
        </li>
        <li className="nav-item">
          <a href="/dashboard">Support</a>
        </li>
      </ul>
    </nav>
  );
};

interface IBalance {
  createdAt: string;
  buyer: {
    name: string;
    stake: number;
    goods: string;
  };
  seller: {
    name: string;
    stake: number;
    goods: string;
  };
  agreement: {
    description: string;
    date: string;
    price: number;
  };
}

const BalanceDetails = ({ balance }: { balance: IBalance }) => {
  const { createdAt, agreement, buyer, seller } = balance;

  return (
    <section className="balance-section">
      <div className="balance-created-date">Created {createdAt}</div>

      <div className="balance-cards-container">
        <div className="balance-participants-card">
          <div className="balance-participant-container">
            <div className="balance-participant-photo">{/* TODO */}</div>

            <div className="balance-participant-details">
              <div className="balance-stake">
                {buyer.name} has staked ${buyer.stake}
              </div>
              <div className="balance-goods">{buyer.goods}</div>
            </div>
          </div>

          <div className="balance-participant-container">
            <div className="balance-participant-photo">{/* TODO */}</div>

            <div className="balance-participant-details">
              <div className="balance-stake">
                {seller.name} has staked ${seller.stake}
              </div>
              <div className="balance-goods">{seller.goods}</div>
            </div>
          </div>
        </div>

        <div className="balance-agreement-container">
          <h5 className="balance-agreement-header">Balance Agreement</h5>

          <div className="balance-agreement-text">
            {agreement.description} by{' '}
            <span className="text-bold">{agreement.date}</span>…
          </div>

          <div className="balance-agreement-price">${agreement.price}</div>
        </div>
      </div>
    </section>
  );
};

interface DashboardProps extends RouteComponentProps<{}> {}

interface DashboardState {}

class Dashboard extends React.Component<DashboardProps, DashboardState> {
  constructor(props: DashboardProps) {
    super(props);

    this.state = {};
  }

  render() {
    // TODO: try out styled components
    return (
      <div className="dashboard-container">
        <SideNav />

        <main className="main-container">
          <div className="main-header">
            <img className="main-logo" src="assets/logo-white.svg" />
            <h3>Current Balances</h3>
          </div>

          <div className="balances-container">
            <BalanceDetails
              balance={{
                createdAt: 'Last Tuesday',
                buyer: {
                  name: 'Josh',
                  stake: 1000,
                  goods: 'For 4 solar panel installations'
                },
                seller: {
                  name: 'Toro',
                  stake: 500,
                  goods: 'To install 4 solar panels'
                },
                agreement: {
                  description: `Toro the Solar Panel technian has agreed to install 4 solar panels on Josh’s roof`,
                  date: 'May 25th 2018',
                  price: 4000
                }
              }}
            />

            <BalanceDetails
              balance={{
                createdAt: 'Last Month',
                buyer: {
                  name: 'Josh',
                  stake: 800,
                  goods: 'For 3 solar panel installations'
                },
                seller: {
                  name: 'Toro',
                  stake: 300,
                  goods: 'To install 3 solar panels'
                },
                agreement: {
                  description: `Toro the Solar Panel technian has agreed to install 3 solar panels on Josh’s roof`,
                  date: 'May 21th 2018',
                  price: 3600
                }
              }}
            />

            <section className="create-balance-container">
              <button className="btn-primary create-balance-btn">
                <img src="assets/btn-logo-1.svg" />
                Create Balance
              </button>
            </section>
          </div>
        </main>
      </div>
    );
  }
}

export default Dashboard;
