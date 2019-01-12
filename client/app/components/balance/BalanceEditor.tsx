import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { merge } from 'lodash';
import { SideNav } from '../nav';
import BalanceContractDetails from './BalanceContractDetails';
import BalanceStakeDetails from './BalanceStakeDetails';
import { get_balance_data, editBalance } from '../../helpers/usersbalances';
import { logout, getUserData, isLoggedIn } from '../../helpers/auth';
import { IBalanceUser, IBalanceAgreement, IBalance } from './BalanceElements';
import './Balance.less';

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

interface BalanceCreatorProps extends RouteComponentProps<{}> {}

interface BalanceCreatorState {
  balance: IBalance;
  selected: BalanceStep;
  error?: string;
  edit?: boolean;
  user_id:number;
  balance_state_string:string;
  other_balancer_email:string;
}

class BalanceEditor extends React.Component<BalanceCreatorProps & RouteComponentProps<{}>,BalanceCreatorState> {
  
  constructor(props: BalanceCreatorProps & RouteComponentProps<{}>) {
    super(props);

    var initUser = {stake:""};

    this.state = {

      user_id:null,
      selected: null,
      error:null,
      edit:false,
      balance_state_string:"active", 
      other_balancer_email:null,

      balance: {
        buyer: {} as IBalanceUser, 
        seller: {} as IBalanceUser,
        agreement: {} as IBalanceAgreement,
        balance_id:null,
      },

    };

  }

  componentDidMount() {

    var user_email;
    var userdata;

    getUserData()
    .then(userdata_array => {  
      if (userdata_array) {
        
        userdata = userdata_array[0];
        let has_connect_account = false;
        let has_customer_id = false;

        if (userdata.stripe_connect_account_token) {
          has_connect_account = true;
        }

        if (userdata.stripe_customer_id) {
          has_customer_id = true;
        }

        user_email = userdata.email;
        var user_alias = user_email.substr(0, user_email.indexOf('@')); 
        var num_completed_balances = userdata.num_completed_balances;

        var currentUser = { username: user_alias, 
                            email:user_email,
                            num_completed_balances: num_completed_balances 
                          };

        this.setState({user_id:userdata.id})
      }
      
    });
      

    var balance_id = JSON.parse(localStorage.getItem("balance_id"));
    var other_balancer_email;

    if (balance_id) {

      this.setState({edit:true})    
      this.handleUpdateBalance({balance_id:balance_id})

      get_balance_data({balance_id:balance_id})
      .then(balance_data_array => {
       
        var balance_data = balance_data_array[0];

        console.log('balance_data', balance_data)
        this.setState({balance_state_string:balance_data.state_string});

        //other_balancer_email
        if ( balance_data.seller_id == userdata.id) {
          other_balancer_email = balance_data.buyer_email;
        } else {
          other_balancer_email = balance_data.seller_email;
        }

        this.setState({other_balancer_email:other_balancer_email,
                       balance_state_string:balance_data.state_string})
        
        const seller = {email:balance_data.seller_email,
                        id:balance_data.seller_id,
                        };

        const buyer = {email:balance_data.buyer_email,
                        id:balance_data.buyer_id,
                        };

        this.handleUpdateBalance({seller:seller})
        this.handleUpdateBalance({buyer:buyer})

        
        const initAgreement = {  title:balance_data.title,
                                 buyer_obligation:balance_data.buyer_obligation,
                                 seller_obligation:balance_data.seller_obligation,
                                 description:balance_data.balance_description, 
                                 payment:balance_data.balance_price, 
                                 duration:balance_data.duration,
                                 duration_units:balance_data.duration_units,
                              };

        this.handleUpdateBalance({agreement:initAgreement})

        const initBuyerStake = {stake:balance_data.buyer_stake_amount};
        const initSellerStake = {stake:balance_data.seller_stake_amount};

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

    console.log("userid, balance ",this.state.user_id, balanceInfo);
    
    
    if (balanceInfo.agreement.title && 
        balanceInfo.agreement.buyer_obligation && 
        balanceInfo.agreement.seller_obligation &&
        balanceInfo.buyer.stake &&
        balanceInfo.seller.stake) {
      
      editBalance(balanceInfo)
      .then((balance_id) => {

        localStorage.setItem("balance_id",null);

        if (this.state.user_id == balanceInfo.buyer.id) {
          history.push('/buying-balances')
        } else if (this.state.user_id == balanceInfo.seller.id) {
          history.push('/selling-balances')
        }

      })

    } else if (!balanceInfo.agreement.title || !balanceInfo.agreement.buyer_obligation || 
               !balanceInfo.agreement.seller_obligation){

      return this.setState({ error: 'The contract title, buyer and seller obligations are required',
                             selected: BalanceStep.SET_AGREEMENT });

    } else if (!balanceInfo.buyer.stake || !balanceInfo.seller.stake) {

      return this.setState({ error: 'the buyer and seller must place a non-zero stake, even if it is small',
                             selected: BalanceStep.SET_STAKE });

    }
    
  }
 
  renderEditStake() {

    const { balance, selected, balance_state_string } = this.state;
    const { buyer, seller, agreement } = balance;

    if (balance_state_string == "active") {

      return (
        <div> </div>
      );

    } else {

      return (
        <div>
        <div className="new-balance-header-container">
          <span className="new-balance-step">
            Change stakes
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
        </div> 
      );

    }
    
  }
  
  render() {

    const { balance, selected, other_balancer_email } = this.state;
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
            <h3>Edit the Balance</h3>
          </div>

          <div className="new-balance-container">
            <section className="new-balance-box">

              <div className="new-balance-header-container">
                <span className="new-balance-step">
                  You are about to propose an edit your balance with {other_balancer_email}.
                  If {other_balancer_email} has already agreed to a previous version of this
                  balance, they will need to approve of these edits before the new
                  version replaces the old balance. If they do not agree to your proposed
                  edits the original terms will continue to hold. 
                </span>
              </div>

              <div className="new-balance-action-container">
                <BalanceStepCard
                  text={
                     `${agreement.title} within ${agreement.duration} ${agreement.duration_units}`           
                  }
                  subtext={
                    "click here to edit the balance"
                  }
                  isSelected={selected === BalanceStep.SET_AGREEMENT}
                  onSelect={() =>
                    this.setState({ selected: BalanceStep.SET_AGREEMENT })
                  }
                />
              </div>

              {this.renderEditStake()}

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
              Submit and Return to Current Balances
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

export default BalanceEditor ;
export { IBalanceUser, BalanceEditor }
