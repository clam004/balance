import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { merge } from 'lodash';
import { SideNav } from '../nav';
import BalanceUserDetails from './BalanceUserDetails';
import BalanceContractDetails from './BalanceContractDetails';
import BalanceStakeDetails from './BalanceStakeDetails';
import './Balance.less';
import { API_URL } from '../../helpers/transactions';

enum BalanceStep {
  SELECT_USER = 'SELECT_USER',
  SET_AGREEMENT = 'SET_AGREEMENT',
  SET_STAKE = 'SET_STAKE'
}

interface BalanceStepCardProps {
  text: string;
  subtext: string;
  isSelected?: boolean;
  isSelectable?: boolean;
  onSelect?: () => void;
}

const BalanceStepCard = ({
  text,
  subtext,
  isSelected,
  onSelect,
  isSelectable = true
}: BalanceStepCardProps) => {
  return (
    <div
      className={`new-balance-action-card ${isSelected ? 'selected' : ''} ${
        isSelectable ? 'selectable' : ''
      }`}
      onClick={onSelect}
    >
      <span className="action-selector" />
      <span>
        <div className="action-description">{text}</div>

        <div className="action-subtext">{subtext}</div>
      </span>
    </div>
  );
};

interface IBalanceUser {
  id:number,
  username: string;
  stake?: number;
  goods?: string;
  num_completed_balances?: number;
  failures?: number;
}

interface IBalanceAgreement {
  title?: string;
  description?: string;
  date?: string;
  price?: number;
}

interface IBalance {
  createdAt?: string;
  buyer: IBalanceUser;
  seller: IBalanceUser;
  agreement: IBalanceAgreement;
}

interface BalanceCreatorProps extends RouteComponentProps<{}> {}

interface BalanceCreatorState {
  balance: IBalance;
  selected: BalanceStep;
}

class BalanceCreator extends React.Component<
  BalanceCreatorProps,
  BalanceCreatorState
> {
  constructor(props: BalanceCreatorProps) {
    super(props);

    var user_id = JSON.parse(localStorage.getItem("user_id"));
    var user_email = JSON.parse(localStorage.getItem("user_email"));
    var user_alias = user_email.substr(0, user_email.indexOf('@')); 
    var num_completed_balances = JSON.parse(localStorage.getItem("num_completed_balances"));
    
    const currentUser = { id:user_id,
                          username: user_alias, 
                          num_completed_balances: num_completed_balances };

    this.state = {
      balance: {
        buyer: currentUser,
        seller: {} as IBalanceUser,
        agreement: {} as IBalanceAgreement
      },
      selected: null
    };
  }

  handleUpdateBalance(updates: any) {
    const { balance } = this.state;
    console.log(updates)
    // TODO: connect to API
    this.setState({
      balance: merge({}, balance, updates),
      selected: null
    });
  }

  renderBalanceDetails() {
    const { selected, balance } = this.state;
    const { buyer, seller, agreement } = balance;

    switch (selected) {
      case BalanceStep.SELECT_USER:
        return (
          <BalanceUserDetails
            onSelectUser={this.handleUpdateBalance.bind(this)}
            onInvite={invite => console.log('Invite sent:', invite)}
          />
        );
      case BalanceStep.SET_AGREEMENT:
        return (
          <BalanceContractDetails
            agreement={agreement}
            onUpdate={this.handleUpdateBalance.bind(this)}
          />
        );
      case BalanceStep.SET_STAKE:
        return (
          <BalanceStakeDetails
            buyer={buyer}
            seller={seller}
            onUpdate={this.handleUpdateBalance.bind(this)}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { balance, selected } = this.state;
    const { buyer, seller, agreement } = balance;

    // TODO: try out styled components
    return (
      <div className="dashboard-container">
        <SideNav />

        <main className="main-container">
          <div className="main-header">
            <img className="main-logo" src="assets/logo-white.svg" />
            <h3>Creating Balance</h3>
          </div>

          <div className="new-balance-container">
            <section className="new-balance-box">
              <div className="new-balance-header-container">
                <span className="new-balace-step-num">1</span>
                <span className="new-balance-step">
                  Select who to make a Balance with
                </span>
              </div>

              <div className="new-balance-action-container">
                <BalanceStepCard
                  text={buyer.username}
                  subtext={`${buyer.num_completed_balances} successful contracts`}
                  isSelectable={false}
                />

                <div className="new-balance-logo-divider">
                  <img src="assets/logo-gray.svg" />
                </div>

                <BalanceStepCard
                  text={seller.username || 'Select someone to make a Balance with'}
                  subtext={
                    seller.num_completed_balances
                      ? `${seller.num_completed_balances} successful contracts`
                      : 'Select or invite someone to Balance'
                  }
                  isSelected={selected === BalanceStep.SELECT_USER}
                  onSelect={() =>
                    this.setState({ selected: BalanceStep.SELECT_USER })
                  }
                />

              </div>

              <div className="new-balance-header-container">
                <span className="new-balace-step-num">2</span>
                <span className="new-balance-step">
                  Add the things you will do or want done
                </span>
              </div>

              <div className="new-balance-action-container">
                <BalanceStepCard
                  text={
                    agreement.title && seller.username
                      ? `${agreement.title} from ${seller.username}`
                      : 'Add an agreement to the contract'
                  }
                  subtext={
                    agreement.title && agreement.description
                      ? 'See contract details here'
                      : 'Make a quick list of the things you want done'
                  }
                  isSelected={selected === BalanceStep.SET_AGREEMENT}
                  onSelect={() =>
                    this.setState({ selected: BalanceStep.SET_AGREEMENT })
                  }
                />
              </div>

              <div className="new-balance-header-container">
                <span className="new-balace-step-num">3</span>
                <span className="new-balance-step">
                  Decide how much to stake.
                </span>
              </div>

              <div className="new-balance-action-container">
                <BalanceStepCard
                  text={
                    buyer.stake
                      ? `${buyer.username} staked $${buyer.stake}`
                      : 'Decide how much you want to stake'
                  }
                  subtext={
                    seller.username && seller.stake
                      ? `${seller.username} staked $${seller.stake}`
                      : 'Stakes help build trust and mutual intention'
                  }
                  isSelected={selected === BalanceStep.SET_STAKE}
                  onSelect={() =>
                    this.setState({ selected: BalanceStep.SET_STAKE })
                  }
                />
              </div>
            </section>

            <section className="new-balance-detail-container">
              {this.renderBalanceDetails()}
            </section>
          </div>

          <section className="create-balance-container">
            {/* TODO: update button logo */}
            <button className="btn-primary create-balance-btn">
              <img src="assets/btn-logo-1.svg" />
              Send Balance
            </button>
          </section>
        </main>
      </div>
    );
  }
}

export default BalanceCreator;
