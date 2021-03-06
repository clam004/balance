import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';

import {  getBalances, 
          balanceApprove, 
          toggleComplete, 
          balanceDone,
          balanceDelete,
          archiveEdit,
          approveEdit,
          arbitrateBalance } from '../../helpers/usersbalances';  

import { buyerPaySeller, stakeBalance } from '../../helpers/transactions';
import { logout, getUserData, isLoggedIn } from '../../helpers/auth';
import { HttpResponse, get, post, del } from '../../helpers/http';
import { BalanceParticipantDetails, IBalance } from './Elements';
import { Buyer_lower_right_buttons, Seller_lower_right_buttons } from './CurrentBalances';

import './Dashboard.less';
import '../balance/Balance.less';
import moment from 'moment';
import { SideNav } from '../nav';

class CurrentBalances extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      data: [],
      isLoading: false,
      user_id:null,
      has_connect_account:null,
      has_customer_id:null,
      user_email:null,
      balance_id_buyer_says_complete:null,
      balance_id_buyer_says_arbitration:null,
      balance_id_buyer_says_delete:null,
      balance_id_to_active:null,
      edit_list:[],
      buyer_or_seller_id:"seller_id",
    }

    this.toggleApproveState = this.toggleApproveState.bind(this);
  }
 
  componentDidMount() {

    const { history } = this.props;
    var { buyer_or_seller_id } = this.state;
  
    isLoggedIn()
    .then((res)=>{
      if (!res.is_logged_in) {
        history.push('/login');
      }
    })
    
    this.setState({ isLoading: true });
    
    getUserData()
    .then(userdata => {  
      if (userdata) {
        //console.log("userdata", userdata[0]);
        let has_connect_account = false;
        let has_customer_id = false;
        if (userdata[0].stripe_connect_account_token) {
          has_connect_account = true;
        } else {
          history.push('/myaccount');
        }
        if (userdata[0].stripe_customer_id) {
          has_customer_id = true;
        }

        this.setState({
           user_id:userdata[0].id,
           has_connect_account:has_connect_account,
           has_customer_id:has_customer_id,  
           user_email:userdata[0].email, 
           isLoading:false
        }); 

      }
    });

    console.log("mounted buyer_or_seller_id", buyer_or_seller_id)

    this.loadBalancesToData(buyer_or_seller_id)
    
    /* 
    this.interval = setInterval(() => {

    }, 10000);
    */

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  loadBalancesToData(buyer_or_seller_id) {
    getBalances({buyer_or_seller_id:buyer_or_seller_id})
    .then(data => {
      if (Array.isArray(data)) {
        this.setState({data:data});     
      }
    });
  }

  toggleApproveState(index) {
    let balance: IBalance[] = this.state.data.splice(index,1); 
    if (this.state.buyer_or_seller_id == "seller_id") {
      balance[0].seller_approves_contract = !balance[0].seller_approves_contract;
    } else {
      balance[0].buyer_approves_contract = !balance[0].buyer_approves_contract; 
    }
    let balances: IBalance[] = [...this.state.data];
    balances.splice(index, 0, balance[0]);
    this.setState({data:balances});
    if (balance[0].buyer_approves_contract && balance[0].seller_approves_contract) {
      balance[0].state_string = 'active';
      this.setState({balance_id_to_active:balance[0].id});
    }
  }

  toggleSellerSaysCompleteState(index) {
    let balance: IBalance[] = this.state.data.splice(index,1); 
    balance[0].seller_indicates_delivered = !balance[0].seller_indicates_delivered; 
    let balances: IBalance[] = [...this.state.data];
    balances.splice(index, 0, balance[0]);
    this.setState({data:balances});
  }

  toggleBuyerSaysCompleteState(index) {
    // toggles the balance display array element  
    let balance: IBalance[] = this.state.data.splice(index,1); 
    balance[0].buyer_indicates_delivered = !balance[0].buyer_indicates_delivered; 
    let balances: IBalance[] = [...this.state.data];
    balances.splice(index, 0, balance[0]);
    this.setState({data:balances});
  }

  completeBalance(index) {
    // removes the balance at index form the display array 
    let balance: IBalance[] = this.state.data.splice(index,1); 
    const balances: IBalance[] = [...this.state.data]
    this.setState({data:balances});
  }

  remove(array, element) {
    return array.filter(el => el !== element);
  }

  toggleSeeEdit(index) {

    let edit_list = this.state.edit_list;
    var edit_list_includes_index = edit_list.includes(index);

    if (edit_list_includes_index) {
      let shorter_list = this.remove(edit_list,index);
      this.setState({edit_list:shorter_list});
    } else {
      edit_list.push(index);
      this.setState({edit_list:edit_list});
    }

    let balance: IBalance[] = this.state.data.splice(index,1);
    let balance_temp = JSON.parse(JSON.stringify(balance)); // hack to make a deep copy of object or array 
    var balance_state = balance[0].state_string;
    
    if (balance_state=='proposed_edit') {
      // toggle balance_state and change what is being displayed 
      balance[0].state_string = 'edit_displayed'; 

      balance[0].title = balance[0].title_prelim; 
      balance[0].balance_description = balance[0].balance_description_prelim; 
      balance[0].buyer_obligation = balance[0].buyer_obligation_prelim; 
      balance[0].seller_obligation = balance[0].seller_obligation_prelim; 
      balance[0].balance_price = balance[0].balance_price_prelim; 
      balance[0].due_date = balance[0].due_date_prelim; 

      balance[0].title_prelim = balance_temp[0].title; 
      balance[0].balance_description_prelim = balance_temp[0].balance_description; 
      balance[0].buyer_obligation_prelim = balance_temp[0].buyer_obligation; 
      balance[0].seller_obligation_prelim = balance_temp[0].seller_obligation; 
      balance[0].balance_price_prelim = balance_temp[0].balance_price; 
      balance[0].due_date_prelim = balance_temp[0].due_date; 

      // re-render the page 
      let balances: IBalance[] = [...this.state.data];
      balances.splice(index, 0, balance[0]);
      this.setState({data:balances});

    } else if (balance_state=='edit_displayed') {
      // toggle balance_state and change what is being displayed
      balance[0].state_string = 'proposed_edit'; 

      balance[0].title = balance[0].title_prelim; 
      balance[0].balance_description = balance[0].balance_description_prelim; 
      balance[0].buyer_obligation = balance[0].buyer_obligation_prelim; 
      balance[0].seller_obligation = balance[0].seller_obligation_prelim; 
      balance[0].balance_price = balance[0].balance_price_prelim; 
      balance[0].due_date = balance[0].due_date_prelim; 

      balance[0].title_prelim = balance_temp[0].title; 
      balance[0].balance_description_prelim = balance_temp[0].balance_description; 
      balance[0].buyer_obligation_prelim = balance_temp[0].buyer_obligation; 
      balance[0].seller_obligation_prelim = balance_temp[0].seller_obligation; 
      balance[0].balance_price_prelim = balance_temp[0].balance_price; 
      balance[0].due_date_prelim = balance_temp[0].due_date; 

      // re-render the page 
      let balances: IBalance[] = [...this.state.data];
      balances.splice(index, 0, balance[0]);
      this.setState({data:balances});

    }
    
  }

  rejectEdits(index) {

    let balance: IBalance[] = this.state.data.splice(index,1);

    if (balance[0].seller_approves_contract && balance[0].seller_approves_contract) {
      balance[0].state_string = "active";
    } else {
      balance[0].state_string = "new";
    }

    archiveEdit(balance[0]);

    balance[0].title = balance[0].title_prelim; 
    balance[0].balance_description = balance[0].balance_description_prelim; 
    balance[0].buyer_obligation = balance[0].buyer_obligation_prelim; 
    balance[0].seller_obligation = balance[0].seller_obligation_prelim; 
    balance[0].balance_price = balance[0].balance_price_prelim; 
    balance[0].due_date = balance[0].due_date_prelim; 

    let balances: IBalance[] = [...this.state.data];
    balances.splice(index, 0, balance[0]);
    this.setState({data:balances});
  }

  acceptEdits(index) {

    let balance: IBalance[] = this.state.data.splice(index,1);

    if (balance[0].seller_approves_contract && balance[0].seller_approves_contract) {
      balance[0].state_string = "active";
    } else {
      balance[0].state_string = "new";
    }

    approveEdit(balance[0]);

    let balances: IBalance[] = [...this.state.data];
    balances.splice(index, 0, balance[0]);
    this.setState({data:balances});    
  }

  renderBalances(data) {

      //if (this.state.data.length == 0) {
      if (data.length == 0) {

        return (<div> No active or pending balances </div>);

      } else {
      
        //return this.state.data.map((balance, array_index) => {
        return data.map((balance, array_index) => {

          var user_id = this.state.user_id;

          var lower_right_buttons;

          if (this.state.buyer_or_seller_id == "seller_id") {

            if (balance.seller_approves_contract == null && balance.buyer_approves_contract == true &&
                balance.buyer_indicates_delivered == false && balance.seller_indicates_delivered == false) {

              lower_right_buttons = (

                <div className="balance-agreement-text">

                  <label> 
                    <h5 className="balance-agreement-header">
                    {balance.buyer_email} {' '} has proposed this balance. 
                    Please indicate you agree with these terms, propose edits
                    or delete this balance. Once confirmed the balance will be active. 
                    </h5>
                  </label>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      this.toggleApproveState(array_index);
                    }}
                  >
                   confirm you agree with terms
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      const { history } = this.props;
                      localStorage.setItem("balance_id", JSON.stringify(balance.id)); 
                      history.push('/edit') 
                    }}
                  >
                   propose edit to the balance
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      this.setState({balance_id_buyer_says_delete:balance.id});
                    }}
                  >
                   delete balance 
                  </button>

                </div>
              )

            // 2. Seller approves and buyer has not indicated yet 

            } else if (balance.seller_approves_contract == true && balance.buyer_approves_contract == null &&
                balance.buyer_indicates_delivered == false && balance.seller_indicates_delivered == false) {

              lower_right_buttons = (

                <div className="balance-agreement-text">

                  <label> 
                    <h5 className="balance-agreement-header">
                      Once {balance.buyer_email} confirms the balance will be active. 
                    </h5>
                  </label>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      const { history } = this.props;
                      localStorage.setItem("balance_id", JSON.stringify(balance.id)); 
                      history.push('/edit') 
                    }}
                  >
                   propose edit to the balance
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      this.setState({balance_id_buyer_says_delete:balance.id});
                    }}
                  >
                   delete balance 
                  </button>

                </div>
              )
            // 3. Both Seller and Buyer have approved, making balance.seller_approves_contract == true 
            // now it is time to do the work in the contract, for now we have decided to have the rejection button disappear. 
            // During the process of working on the balance the seller cen decide to propose edits or indicate completed 

            } else if (balance.seller_approves_contract == true && balance.buyer_approves_contract == true &&
                       balance.buyer_indicates_delivered == false && balance.seller_indicates_delivered == false)  {

              lower_right_buttons = (

                <div className="balance-agreement-text">

                  <label> 
                    <h5 className="balance-agreement-header">
                     You have agreed to complete this balance for {balance.buyer_email}
                    </h5>
                  </label>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      toggleComplete({id:balance.id, 
                                      completed_boolean:balance.seller_indicates_delivered, 
                                      seller_or_buyer:'seller'});
                      this.toggleSellerSaysCompleteState(array_index);
                    }}
                  >
                   indicate balance completed & delivered
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      const { history } = this.props;
                      localStorage.setItem("balance_id", JSON.stringify(balance.id)); 
                      history.push('/edit') 
                    }}
                  >
                   propose edit to the balance
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      this.setState({balance_id_buyer_says_arbitration:balance.id});
                    }}
                  >
                   move balance to arbitration 
                  </button>
                </div>
              )

            // 4. Both approve, Seller has indicated they have completed and delivered the balance and is waiting
            // for the Buyer to indicate they have received a completed balance thereby complteing the balance, 
            // we leave open the option of reverting back to the balance.seller_indicates_delivered == false state
            // but when in the state 

            } else if (balance.seller_approves_contract == true && balance.buyer_approves_contract == true &&
                       balance.buyer_indicates_delivered == false && balance.seller_indicates_delivered == true)  {
        
              lower_right_buttons = (

                <div className="balance-agreement-text">

                  <label> 
                     You indicated the balance has been completed and delivered. 
                     Waiting for {balance.buyer_email} to confirm a completed balance was received.
                     Until they confirm, you have the option to undo. 
                  </label>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      toggleComplete({id:balance.id, 
                                      completed_boolean:balance.seller_indicates_delivered, 
                                      seller_or_buyer:'seller'});
                      this.toggleSellerSaysCompleteState(array_index);
                    }}
                  >
                   undo completed & delivered 
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      const { history } = this.props;
                      localStorage.setItem("balance_id", JSON.stringify(balance.id)); 
                      history.push('/edit') 
                    }}
                  >
                   propose edit to the balance
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      this.setState({balance_id_buyer_says_arbitration:balance.id});
                    }}
                  >
                   move balance to arbitration 
                  </button>

                </div>
              )
            }
                
          } else if (this.state.buyer_or_seller_id == "buyer_id") {

            if (balance.seller_approves_contract == null && balance.buyer_approves_contract == true &&
                balance.buyer_indicates_delivered == false && balance.seller_indicates_delivered == false)  {
        
              lower_right_buttons = (

                <div className="balance-agreement-text">

                  <label> 
                   Your Balance details are in the Current Balances of {balance.seller_email} awaiting confirmation.
                   Once they agree, the balance becomes active.  
                  </label>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      const { history } = this.props;
                      localStorage.setItem("balance_id", JSON.stringify(balance.id));
                      history.push('/edit') 
                    }}
                  >
                   propose edit to the balance
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      this.setState({balance_id_buyer_says_delete:balance.id});
                    }}
                  >
                   delete balance 
                  </button>

                </div>
              )

            // 2. Seller has written a new balance or has edited the balance and waiting for the Buyer to agree to the terms 

            } else if (balance.seller_approves_contract == true && balance.buyer_approves_contract == null &&
                balance.buyer_indicates_delivered == false && balance.seller_indicates_delivered == false)  {
        
              lower_right_buttons = (

                <div className="balance-agreement-text">

                  <label> 
                    <h5 className="balance-agreement-header">
                    {balance.seller_email} {' '} has proposed this balance. 
                    Please indicate you agree with these terms, propose edits
                    or delete this balance. Once confirmed the balance will be active. 
                    </h5>
                  </label>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      this.toggleApproveState(array_index);
                    }}
                  >
                   confirm you agree with terms
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      const { history } = this.props;
                      localStorage.setItem("balance_id", JSON.stringify(balance.id)); 
                      history.push('/edit') 
                    }}
                  >
                   propose edit to the balance
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      this.setState({balance_id_buyer_says_delete:balance.id});
                    }}
                  >
                   delete balance 
                  </button>

                </div>
              )
            // 3. Buyer and seller agreed to the terms, seller presumably working on the balance 

            } else if (balance.seller_approves_contract == true && 
                       balance.buyer_approves_contract == true &&
                       balance.seller_indicates_delivered == false)  {
        
              lower_right_buttons = (

                <div className="balance-agreement-text">

                  <label> 
                    <h5 className="balance-agreement-header">
                     {balance.seller_email} {' '} has confirmed they agree.
                     Changes to the balance will require both parties to agree. 
                    </h5>
                  </label>

                  <br/><br/>
                  
                  <button className="btn-primary"
                    onClick={() => {
                      // open confirm option
                      this.toggleBuyerSaysCompleteState(array_index);
                    }}
                  >
                    {balance.buyer_indicates_delivered ? 'undo complete' : 'indicate balance completed & delivered'}   
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      const { history } = this.props;
                      localStorage.setItem("balance_id", JSON.stringify(balance.id)); 
                      history.push('/edit') 
                    }}
                  >
                   propose edit to the balance
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      this.setState({balance_id_buyer_says_arbitration:balance.id});
                    }}
                  >
                   move balance to arbitration 
                  </button>

                </div>
              )

            // 4. Buyer and seller agreed to the terms, seller indicated the balance is completed and delivered 
            // buyer has the choice to complete

            } else if (balance.seller_approves_contract == true && 
                       balance.buyer_approves_contract == true &&
                       balance.seller_indicates_delivered == true)  {
        
              lower_right_buttons = (

                <div className="balance-agreement-text">

                  <label> 
                    {balance.seller_email} {' '} has indicated that the balance has been completed and delivered.
                    If the balance has been delivered according to the terms, please confirm & complete the balance.
                    
                    If you are not satisfied, please negotiate with your seller by email to work out a completed balance
                    before moving to arbitration. 

                  </label>

                  <br/><br/>
                  
                  <button className="btn-primary"
                    onClick={() => {
                      // open confirm option
                      this.toggleBuyerSaysCompleteState(array_index);
                    }}
                  >
                    {balance.buyer_indicates_delivered ? 'undo complete' : 'indicate balance completed & delivered'}  
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      const { history } = this.props;
                      localStorage.setItem("balance_id", JSON.stringify(balance.id)); 
                      history.push('/edit') 
                    }}
                  >
                   propose edit to the balance
                  </button>

                  <br/><br/>

                  <button className="btn-primary"
                    onClick={() => {
                      this.setState({balance_id_buyer_says_arbitration:balance.id});
                    }}
                  >
                   move balance to arbitration 
                  </button>

                </div>
              )
            }

          }

          // Decides what goes into the left part of the balance card 
          var participant_or_finish;

          if (this.state.buyer_or_seller_id == "seller_id") {

            if (balance.id == this.state.balance_id_buyer_says_complete) {

              participant_or_finish = (

                // Finish State

                <div key={balance.id} className="balance-participants-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                       Buy clicking Finish Balance you agree that the seller has 
                       fullfilled their part of the agreement. This will bring 
                       the balance to a conclusion and the agreed upon price will
                       be transfered from your credit card or bank account 
                       to the sellers account. 
                      </div>
                    </div>
                  </div>

                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                        <button className="btn-primary"
                          onClick={() => {
                            balanceDone({balance}); // moves balance to history so buyer can't double pay. 
                            buyerPaySeller({balance});
                            this.completeBalance(array_index);
                          }}
                        >
                         Finish Balance
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              )

            } else if (balance.id == this.state.balance_id_buyer_says_arbitration) {

              participant_or_finish = (

                <div key={balance.id} className="balance-participants-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                        Arbitration is only for cases in which an agreement cannot be reached between the buyer and seller.
                        We encourage you to start a discussion by email that may result in the Balance being completed 
                        before moving to arbitration. Save those email for use in arbitration.
                        Once the Balance is moved to arbitration, the 20% arbitration fee
                        will be collected by Balance. 
                      </div>
                    </div>
                  </div>

                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                        <button className="btn-primary"
                          onClick={() => {
                            arbitrateBalance({balance});
                            this.completeBalance(array_index);
                          }}
                        >
                         Move Balance to Arbitration 
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              )

            } else if (balance.id == this.state.balance_id_buyer_says_delete) {

              participant_or_finish = (

                <div key={balance.id} className="balance-participants-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                        Are you sure you want to delete this balance?
                      </div>
                    </div>
                  </div>

                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">

                        <button className="btn-primary"
                          onClick={() => {
                            balanceDelete({id:balance.id})
                            .then(res => {
                              console.log('deleted',res)
                            })
                            this.completeBalance(array_index);
                          }}
                        >
                         delete this balance
                        </button>

                        <button className="btn-primary"
                          onClick={() => {
                            this.setState({balance_id_buyer_says_delete:null});
                          }}
                        >
                         keep balance
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              )

            } else if (balance.id == this.state.balance_id_to_active) {

              participant_or_finish = (

                <div key={balance.id} className="balance-participants-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                        Are you sure you want to activate this balance?
                      </div>
                    </div>
                  </div>

                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">

                        <button className="btn-primary"
                          onClick={() => {
                            stakeBalance({balance})
                            .then(res => {
                              console.log(res)
                            })

                            balanceApprove({
                              id:balance.id, 
                              seller_id:balance.seller_id,
                              buyer_id:balance.buyer_id,
                              seller_approves_contract:balance.seller_approves_contract,
                              buyer_approves_contract:balance.buyer_approves_contract,
                              seller_or_buyer:'seller',
                            });

                            this.setState({balance_id_to_active:null});
                          }}
                        >
                         activate balance 
                        </button>

                        <button className="btn-primary"
                          onClick={() => {
                            this.setState({balance_id_to_active:null});
                          }}
                        >
                         undo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )

            } else {

              // display each parties obligations and stakes 
              participant_or_finish = <BalanceParticipantDetails balance={balance} />
            }  

          } else if (this.state.buyer_or_seller_id == "buyer_id") {

            if (balance.buyer_indicates_delivered) {

              participant_or_finish = (

                // Finish State

                <div key={balance.id} className="balance-participants-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                       Buy clicking Finish Balance you agree that the seller has 
                       fullfilled their part of the agreement. This will bring 
                       the balance to a conclusion and the agreed upon price will
                       be transfered from your credit card or bank account 
                       to the sellers account. 
                      </div>
                    </div>
                  </div>

                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                        <button className="btn-primary"
                          onClick={() => {   
                            buyerPaySeller({balance})
                            .then(res => {
                              if (res.success) {
                                balanceDone({balance})
                                console.log("SUCCESSFUL PAYMENT", res)
                              } else {
                                console.log("FAILED PAYMENT",res)
                              }
                            })   
                            this.completeBalance(array_index); // removes the balance at index form the display array 
                          }}
                        >
                         Finish Balance
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              )

            } else if (balance.id == this.state.balance_id_buyer_says_arbitration) {

              participant_or_finish = (

                <div key={balance.id} className="balance-participants-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                        Arbitration is only for cases in which an agreement cannot be reached between the buyer and seller.
                        We encourage you to start a discussion by email that may result in the Balance being completed 
                        before moving to arbitration. Save those email for use in arbitration.
                        Once the Balance is moved to arbitration, the 20% arbitration fee
                        will be collected by Balance. 
                      </div>
                    </div>
                  </div>

                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                        <button className="btn-primary"
                          onClick={() => {
                            arbitrateBalance({balance});
                            this.completeBalance(array_index);
                          }}
                        >
                         Move Balance to Arbitration 
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              )

            } else if (balance.id == this.state.balance_id_buyer_says_delete) {

              participant_or_finish = (

                <div key={balance.id} className="balance-participants-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                        Are you sure you want to delete this balance?
                      </div>
                    </div>
                  </div>

                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">

                        <button className="btn-primary"
                          onClick={() => {
                            balanceDelete({id:balance.id})
                            .then(res => {
                              console.log('deleted',res)
                            })
                            this.completeBalance(array_index);
                          }}
                        >
                         delete this balance
                        </button>

                        <button className="btn-primary"
                          onClick={() => {
                            this.setState({balance_id_buyer_says_delete:null});
                          }}
                        >
                         keep balance
                        </button>

                      </div>
                    </div>
                  </div>
                </div>

              )

            } else if (balance.id == this.state.balance_id_to_active) {

              participant_or_finish = (

                <div key={balance.id} className="balance-participants-card">
                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">
                        Are you sure you want to activate this balance?
                      </div>
                    </div>
                  </div>

                  <div className="balance-participant-container">
                    <div className="balance-participant-details">
                      <div className="balance-goods">

                        <button className="btn-primary"
                          onClick={() => {
                            stakeBalance({balance})
                            .then(res => {
                              if (res.bothStaked) {
                                console.log("Stakes successfully collected: ",res)
                                balanceApprove({
                                  id:balance.id, 
                                  seller_id:balance.seller_id,
                                  buyer_id:balance.buyer_id,
                                  seller_approves_contract:balance.seller_approves_contract,
                                  buyer_approves_contract:balance.buyer_approves_contract,
                                  seller_or_buyer:'buyer',
                                })
                                .then(res => {console.log("approve balance", res)})
                                this.setState({balance_id_to_active:null});
                              } else {
                                console.log("Error in Stakes: ", res)
                                alert("both parties must have valid payment accounts")
                                this.setState({balance_id_to_active:null});
                              }
                            })
                          }}
                        >
                         activate balance  
                        </button>

                        <button className="btn-primary"
                          onClick={() => {
                            this.setState({balance_id_to_active:null});
                          }}
                        >
                         undo
                        </button>

                      </div>
                    </div>
                  </div>
                </div>

              )

            } else {

              // display each parties obligations and stakes 

              participant_or_finish = <BalanceParticipantDetails balance={balance} />

            } 

          }

          // decide what goes under the price on the right side of the balance, use to be:agreement_button and completed_button
          // the two sections can be placed inside <div className="balance-agreement-text"> </div>
          
          var header;
          //console.log(balance.state_string, balance.proposer_id, balance.buyer_id)
          if (this.state.buyer_or_seller_id == "seller_id") {    
            if (balance.state_string == 'active') {
              header = (
                <div className="balance-created-date"> 
                  Created {moment(balance.created_at, moment.ISO_8601).fromNow()} 
                  {' - '}
                  Active
                </div>          
              )
            } else if (balance.state_string == 'new') {
              header = (
                <div className="balance-created-date"> 
                  Created {moment(balance.created_at, moment.ISO_8601).fromNow()} 
                  {' - '}
                  Waiting for approval
                </div>          
              )
            } else if (balance.state_string == 'proposed_edit' && balance.proposer_id == balance.buyer_id) {
              header = (
                <div className="balance-created-date"> 
                  Created {moment(balance.created_at, moment.ISO_8601).fromNow()} 
                  {' - '}
                  {balance.buyer_email} has proposed edits
                  <button 
                   className="btn-primary create-balance-btn"
                   onClick={() => {
                    this.toggleSeeEdit(array_index);
                   }}
                  >
                    see new poposed edits 
                  </button>
                </div>          
              )
            } else if (balance.state_string == 'edit_displayed' && balance.proposer_id == balance.buyer_id) {

              header = (
                <div className="balance-created-date"> 
                  Created {moment(balance.created_at, moment.ISO_8601).fromNow()} 
                  {' - '}
                  displaying new proposed edits by {balance.buyer_email}
                  <button 
                   className="btn-primary create-balance-btn"
                   onClick={() => {
                    this.toggleSeeEdit(array_index);
                   }}
                  >
                    return to original contract
                  </button>
                </div>
              )
              lower_right_buttons = (
                <div className="balance-agreement-text">
                  <button 
                   className="btn-primary create-balance-btn"
                   onClick={() => {
                    this.rejectEdits(array_index);
                   }}
                  >
                    decline edits
                  </button>

                  <button 
                   className="btn-primary create-balance-btn"
                   onClick={() => {
                    this.acceptEdits(array_index);
                   }}
                  >
                    accept edits
                  </button>
                </div>
              )
            } else if (balance.state_string == 'proposed_edit' && balance.proposer_id == balance.seller_id) {

              header = (
                <div className="balance-created-date"> 
                  Created {moment(balance.created_at, moment.ISO_8601).fromNow()} 
                  {' - '}
                  suggestions sent to {balance.buyer_email} 
                </div>          
              )
            }
          } else if (this.state.buyer_or_seller_id == "buyer_id") {
            if (balance.state_string == 'active') {
              header = (
                <div className="balance-created-date"> 
                  Created {moment(balance.created_at, moment.ISO_8601).fromNow()} 
                  {' - '}
                  Active
                </div>          
              )
            } else if (balance.state_string == 'new') {
              header = (
                <div className="balance-created-date"> 
                  Created {moment(balance.created_at, moment.ISO_8601).fromNow()} 
                  {' - '}
                  Waiting for approval
                </div>          
              )
            } else if (balance.state_string == 'proposed_edit' && balance.proposer_id == balance.buyer_id) {
              header = (
                <div className="balance-created-date"> 
                  Created {moment(balance.created_at, moment.ISO_8601).fromNow()} 
                  {' - '}
                  suggestions sent to {balance.seller_email} 
                </div>          
              )
            } else if (balance.state_string == 'proposed_edit' && balance.proposer_id == balance.seller_id) {
              header = (
                <div className="balance-created-date"> 
                  Created {moment(balance.created_at, moment.ISO_8601).fromNow()} 
                  {' - '}
                  {balance.seller_email} has proposed edits
                  <button 
                   className="btn-primary create-balance-btn"
                   onClick={() => {
                    this.toggleSeeEdit(array_index);
                   }}
                  >
                    see new poposed edits 
                  </button>
                </div>          
              )
            } else if (balance.state_string == 'edit_displayed' && balance.proposer_id == balance.seller_id) {
              header = (
                <div className="balance-created-date"> 
                  Created {moment(balance.created_at, moment.ISO_8601).fromNow()} 
                  {' - '}
                  displaying new proposed edits by {balance.seller_email}
                  <button 
                   className="btn-primary create-balance-btn"
                   onClick={() => {
                    this.toggleSeeEdit(array_index);
                   }}
                  >
                    return to original contract
                  </button>
                </div>
              )
              lower_right_buttons = (
                <div className="balance-agreement-text">
                  <button 
                   className="btn-primary create-balance-btn"
                   onClick={() => {
                    this.rejectEdits(array_index);
                   }}
                  >
                    decline edits
                  </button>
                  <button 
                   className="btn-primary create-balance-btn"
                   onClick={() => {
                    this.acceptEdits(array_index);
                   }}
                  >
                    accept edits
                  </button>
                </div>
              )
            }
          }
          // put together balance, participant_or_finish, agreement_button, completed_button 
          // the return statement is the same between buying and selling 

          return (

            <section key={balance.id} className="balance-section">
                {header}
              <div className="balance-cards-container">
                {participant_or_finish}
                <div className="balance-agreement-container">
                  <h5 className="balance-agreement-header">
                    {balance.title}
                  </h5>
                  <div className="balance-agreement-text">
                    {balance.balance_description} {' '}
                  </div>
                  <div className="balance-agreement-text">
                    <span className="text-bold">due {' '} {moment(balance.due_date, moment.ISO_8601).fromNow()}</span>
                  </div>
                  <div className="balance-agreement-price">
                    ${balance.balance_price}
                  </div>
                  {lower_right_buttons}    
                </div>
              </div>
            </section>
          );
        }); // end of this.state.data.map((balance, array_index)
      }

  }

  create_button(string) {
    return (
      <button 
       className="btn-primary create-balance-btn"
       onClick={() => {
        localStorage.setItem("balance_id", null); 
       }}
      >
        <img src="assets/btn-logo-1.svg" />
        {string}
      </button>
    );
  }

  renderAccount(buyer_or_seller_id) {

    if (buyer_or_seller_id == "seller_id") {
      return (
         <section className="create-balance-container">
          <Link to="/create-sell">
            {this.create_button("Create Balance to Sell")}
          </Link>  
        </section>       
      );
    } else {
      return (
          <section className="create-balance-container">
            <Link to="/create-buy">
              {this.create_button("Create Balance to Buy")}
            </Link>
          </section>
      );
    }

  }

  renderBuySellToggle(buyer_or_seller_id) {

    if (buyer_or_seller_id == "seller_id") {
      return (
        <img src="assets/switch_right.png" />
      );
    } else {
      return (
        <img src="assets/switch_left2.png" />
      );
    }
  }

  toggleBuyerSellerState(buyer_or_seller_id) {
    console.log(this.state.buyer_or_seller_id)
    if (buyer_or_seller_id == "seller_id") {
      this.setState({buyer_or_seller_id:"buyer_id"},
        this.loadBalancesToData(this.state.buyer_or_seller_id)
      )
    } else {
      this.setState({buyer_or_seller_id:"seller_id"},
        this.loadBalancesToData(this.state.buyer_or_seller_id)
      )
    }
    console.log(this.state.buyer_or_seller_id)
  }

  render() {

    console.log('state at render ', this.state.data) 

    var { data, isLoading, buyer_or_seller_id, user_email } = this.state;

    var user_alias = "You"
    var buyer_or_seller;

    if ( buyer_or_seller_id == "seller_id") {
      buyer_or_seller = "Seller"
    } else {
      buyer_or_seller = "Buyer"
    }

    if (user_email) {
      user_alias = user_email.substr(0, user_email.indexOf('@')); 
    }

    return (

      <div className="dashboard-container">
        <SideNav />
        <main className="main-container">

          <div className="main-header">
            <img className="main-logo" src="assets/logo-white.svg" />
            <h3> Current Balances as {buyer_or_seller} </h3>
            <button 
             className="btn-primary create-balance-btn"
             onClick={() => {
                this.toggleBuyerSellerState(buyer_or_seller_id)
             }}
            >
              Buying { this.renderBuySellToggle(buyer_or_seller_id) } Selling
            </button>
          </div>


          { this.renderAccount(buyer_or_seller_id) }

          <br/>

          <div className="balances-container">
            { this.renderBalances(data) }
          </div>

        </main>

      </div>
    );
  }
}

export default CurrentBalances;

