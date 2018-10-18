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
      duration_units
    };
  }

  render() {

    console.log("state: ",this.state)
    const { title, buyer_obligation, seller_obligation, 
            description, payment, duration, duration_units } = this.state;
    const { onUpdate } = this.props;

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
              rows={1}
              placeholder="responsibilities of payer"
              value={buyer_obligation || ""}
              onChange={e => this.setState({ buyer_obligation: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label-default">Seller Obligations</label>
            <textarea
              className="input-default full-width"
              rows={2}
              placeholder="responsibilities of receiver of payment"
              value={seller_obligation || ""}
              onChange={e => this.setState({ seller_obligation: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label-default">Additional Contract Details</label>
            <textarea
              className="input-default full-width"
              rows={3}
              placeholder="add a summary or details of the agreement"
              value={description || ""}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label-default">Payment Amount</label>
            <input
              className="input-default full-width"
              type="number"
              //min="0"
              placeholder="$ agreed upon price"
              //value={payment || '$ 0.0'}
              onChange={e => this.setState({ payment: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">

            <label className="label-default">Time given to complete balance from this moment</label>
            <input
              type="number"
              //min="0"
              placeholder="(Number)"
              value={duration || ""}
              onChange={e => this.setState({ duration: Number(e.target.value) })}
            />

            <select 
              placeholder="days"
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
            onClick={() =>
              onUpdate({ agreement: { title, buyer_obligation, seller_obligation, description, 
                                      payment, duration, duration_units } })
            }
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
