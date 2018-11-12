import * as React from 'react';

interface Props {
  agreement?: {
    title?: string;
    buyer_obligation?: string;
    seller_obligation?: string;
    description?: string;
    payment?: number;
    duration?: number;
    duration_units?:string
  };
  onUpdate: (updates: any) => void;
}

interface State {
  title: string;
  buyer_obligation: string;
  seller_obligation: string;
  description: string;
  payment: number;
  duration: number;
  payment_str: string;
  duration_str: string;
  duration_units:string
}

class BalanceContractDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { agreement = {} } = props;
    const { title = '', description = '', buyer_obligation = '', seller_obligation = '',
            payment = null, duration = null, duration_units = 'hours' } = agreement;

    this.state = {
      title,
      buyer_obligation,
      seller_obligation,
      description,
      payment,
      duration,
      payment_str: "",
      duration_str: "",
      duration_units
    };
  }

  componentDidMount() {

    if (this.state.payment != null) {
      this.setState({payment_str:this.state.payment.toString()})
    }

    if (this.state.duration != null) {
      this.setState({duration_str:this.state.duration.toString()})
    }

  }

  render() {

    var { title, buyer_obligation, seller_obligation, 
            description, payment, duration, duration_units,
            duration_str, payment_str,
          } = this.state;

    var { onUpdate } = this.props;

    return (
      <div>
        <h4 className="new-balance-detail-header">Contract Builder</h4>

        {/* TODO */}
        <div style={{ paddingLeft: 16, paddingRight: 16 }}>
          <div className="balance-alert">
            <div className="alert-text text-bold">Your First Contract</div>
            <div className="alert-description text-sm">
              Here is where you’ll build you first contract, you can make
              something as simple as couple sentences describing the work, or
              create a task list with due dates for the work.
            </div>
            <div className="alert-action text-sm text-bold">Dismiss</div>
          </div>

          <div className="form-group">
            <label className="label-default">Contract Title</label>
            <input
              className="input-default full-width"
              type="text"
              placeholder="Contract Title"
              value={title || ""}
              onChange={e => this.setState({ title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label-default">Buyer Obligations</label>
            <textarea
              className="input-default full-width"
              rows={3}
              placeholder="responsibilities of payer"
              value={buyer_obligation || ""}
              onChange={e => this.setState({ buyer_obligation: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label-default">Seller Obligations</label>
            <textarea
              className="input-default full-width"
              rows={3}
              placeholder="responsibilities of receiver of payment"
              value={seller_obligation || ""}
              onChange={e => this.setState({ seller_obligation: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label-default">Additional Details</label>
            <textarea
              className="input-default full-width"
              rows={3}
              placeholder="optional"
              value={description || ""}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label-default"> Amount you will pay (blank = $0)</label>
            <input
              className="input-default full-width"
              type="number"
              min="0"
              placeholder="$0"
              value={payment_str}
              onChange={e => {
                if (e.target.value == "") {
                  this.setState({payment:null, payment_str:e.target.value})
                } else {
                  this.setState({payment:Number(e.target.value), payment_str:e.target.value},() =>{
                  })
                }
              }}
            />
          </div>

          <div className="form-group">

            <label className="label-default">Time given to complete balance from this moment</label>
            <input
              type="number"
              min="0"
              placeholder="(Number)"
              value={duration_str}
              onChange={e => {

                if (e.target.value == "") {
                  this.setState({duration:null, duration_str:e.target.value})
                } else {
                  this.setState({duration:Number(e.target.value), duration_str:e.target.value},() =>{
                  })
                }
              }}
            />

            <select 
              value={this.state.duration_units}
              onChange={e => this.setState({ duration_units: e.target.value })}
            >
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
              <option value="days">days</option>
              <option value="months">months</option>
            </select>

          </div>

          <button
            className="btn-primary full-width"
            onClick={() => {
              console.log("payment, duration", payment, duration)
              onUpdate({ agreement: { title, buyer_obligation, seller_obligation, description, 
                                      payment, duration, duration_units } })
            }}
          >
            <img src="assets/btn-logo-1.svg" style={{ marginRight: 16 }} />
            Save Contract
          </button>
        </div>
      </div>
    );
  }
}

export default BalanceContractDetails;
