import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { merge } from 'lodash';
import { SideNav } from '../nav';
import BalanceUserDetails from './BalanceUserDetails';
import BalanceContractDetails from './BalanceContractDetails';
import BalanceStakeDetails from './BalanceStakeDetails';
import './Balance.less';
import { submitBalance, get_balance_data, updateBalance } from '../../helpers/usersbalances';
import { logout, getUserData } from '../../helpers/auth';

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
  id?:number,
  username: string;
  email?:string;
  stake?: number;
  goods?: string;
  num_completed_balances?: number;
  failures?: number;
}

interface IBalanceAgreement {
  title?: string;
  buyer_obligation?: string;
  seller_obligation?: string;
  description?: string;
  date?: string;
  price?: number;
  duration?:number;
  duration_units?:string;
}

interface IBalance {
  createdAt?: string;
  buyer: IBalanceUser;
  seller: IBalanceUser;
  agreement: IBalanceAgreement;
  balance_id?: number;
}

interface BalanceCreatorProps extends RouteComponentProps<{}> {}

interface BalanceCreatorState {
  balance: IBalance;
  selected: BalanceStep;
  error?: string;
  edit?: boolean;
}

class BalanceCreator extends React.Component<
  BalanceCreatorProps & RouteComponentProps<{}>,
  BalanceCreatorState
> {
  constructor(props: BalanceCreatorProps & RouteComponentProps<{}>) {
    super(props);

    var initUser = {stake:""};

    this.state = {
      balance: {
        buyer: {} as IBalanceUser, 
        seller: {} as IBalanceUser,
        agreement: {} as IBalanceAgreement,
        balance_id:null,
      },
      selected: null,
      error:null,
      edit:false,
    };

  }

  componentDidMount() {

    getUserData()
    .then(userdata => {  
      if (userdata) {

        let has_connect_account = false;
        let has_customer_id = false;

        if (userdata[0].stripe_connect_account_token) {
          has_connect_account = true;
        }

        if (userdata[0].stripe_customer_id) {
          has_customer_id = true;
        }

        var user_email = userdata[0].email;
        var user_alias = user_email.substr(0, user_email.indexOf('@')); 
        var num_completed_balances = userdata[0].num_completed_balances;

        var currentUser = { username: user_alias, 
                            email:user_email,
                            num_completed_balances: num_completed_balances 
                          };

        this.handleUpdateBalance({buyer:currentUser})

      }
      
    });
      

    var balance_id = JSON.parse(localStorage.getItem("balance_id"));

    if (balance_id) {

      this.setState({edit:true})    
      this.handleUpdateBalance({balance_id:balance_id})

      get_balance_data({balance_id:balance_id})
      .then(balance_data => {
       
        console.log("balance_data", balance_data[0])
        
        const initUser = {  email:balance_data[0].seller_email,
                            id:balance_data[0].seller_id,
                          };
        
        this.handleUpdateBalance({seller:initUser})

        
        const initAgreement = {  title:balance_data[0].title,
                                 buyer_obligation:balance_data[0].buyer_obligation,
                                 seller_obligation:balance_data[0].seller_obligation,
                                 description:balance_data[0].balance_description, 
                                 payment:balance_data[0].balance_price, 
                                 duration:balance_data[0].duration,
                                 duration_units:balance_data[0].duration_units,
                              };

        this.handleUpdateBalance({agreement:initAgreement})

        const initBuyerStake = {stake:balance_data[0].buyer_stake_amount};
        const initSellerStake = {stake:balance_data[0].seller_stake_amount};

        this.handleUpdateBalance({buyer:initBuyerStake, seller:initSellerStake})

      }) 
    }
  }

  handleUpdateBalance(updates: any) {
    const { balance } = this.state;
    console.log("updates", updates)
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

  handleSubmitBalance(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    const { history } = this.props;
    const balanceInfo = this.state.balance;

    if (!balanceInfo.seller.hasOwnProperty('id')) {
      return this.setState({ error: 'Select a seller',
                             selected: BalanceStep.SELECT_USER });
    } else if (balanceInfo.agreement.title && balanceInfo.agreement.buyer_obligation &&
               balanceInfo.agreement.seller_obligation) {
      
      if (this.state.edit) {

        return updateBalance(balanceInfo)
        .then((balance_id) => {
          localStorage.setItem("balance_id", JSON.stringify(balance_id.id)); 
        })  
        .then(() => history.push('/balancesummary'))

      } else {

        return submitBalance(balanceInfo)
        .then((balance_id) => {
          localStorage.setItem("balance_id", JSON.stringify(balance_id.id)); 
        })  
        .then(() => history.push('/balancesummary'))

      }

    } else {
      return this.setState({ error: 'The contract title, buyer and seller obligations are required',
                             selected: BalanceStep.SET_AGREEMENT });
    }
  }

  render() {

    const { balance, selected } = this.state;
    const { buyer, seller, agreement } = balance;

    const error_state = this.state.error;

    let error_message;

    if (error_state) {
      error_message = <h4>{error_state}</h4>
    } else {
      error_message = <h4>{}</h4>
    }

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
                  text={`${buyer.username} as buyer`} //{buyer.username} 
                  subtext={//`${buyer.num_completed_balances} successful contracts. 
                            `The buyer sets the initial terms of the balance.
                             Once Balance is sent and you both agree on the terms, the balance will be made`}
                  isSelectable={false}
                />

                <div className="new-balance-logo-divider">
                  <img src="assets/logo-gray.svg" />
                </div>

                <BalanceStepCard
                  text={seller.email || 'Select your seller'}
                  subtext={
                    seller.num_completed_balances
                      ? `${seller.num_completed_balances} successful contracts`
                      : 'choose existing balancer or invite someone to make a Balance with'
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
                    agreement.title && seller.email
                      ? `${agreement.title} within ${agreement.duration} ${agreement.duration_units}`
                      : 'Add an agreement to the contract'
                  }
                  subtext={
                    agreement.title && agreement.duration
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
                      ? `you staked $${buyer.stake}`
                      : 'Decide how much you want to stake'
                  }
                  subtext={
                    seller.email && seller.stake
                      ? `${seller.email} staked $${seller.stake}`
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
            <button className="btn-primary create-balance-btn"
              type="submit"
              onClick={this.handleSubmitBalance.bind(this)}
            >
              <img src="assets/btn-logo-1.svg" />
              Review and Send Balance 
            </button>
              <div className="output-if-error">
                {error_message}
              </div>
          </section>
        </main>
      </div>
    );
  }
}

export default BalanceCreator ;
export { IBalanceUser, BalanceCreator }
