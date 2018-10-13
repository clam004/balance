import * as React from 'react';

interface Props {
  agreement?: {
    title?: string;
    description?: string;
    payment?: number;
    duration?: number;
    duration_units?:string
  };
  onUpdate: (updates: any) => void;
}

interface State {
  title: string;
  description: string;
  payment: number;
  duration: number;
  duration_units:string
}

class BalanceContractDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { agreement = {} } = props;
    const { title = '', description = '', payment = null, duration = null, duration_units = 'hours' } = agreement;

    this.state = {
      title,
      description,
      payment,
      duration,
      duration_units
    };
  }

  render() {

    console.log("state: ",this.state)
    const { title, description, payment, duration, duration_units } = this.state;
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
            <label className="label-default">Contract Description</label>
            <textarea
              className="input-default full-width"
              rows={8}
              placeholder="Describe the work that you want to have done here. Once you both agree on the terms of the contract the balance will be made."
              value={description || ""}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label-default">Payment Amount</label>
            <input
              className="input-default full-width"
              type="number"
              min="0"
              placeholder="Payment Amount"
              value={payment || ""}
              onChange={e => this.setState({ payment: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">

            <label className="label-default">Time to complete Balance</label>
            <input
              type="number"
              min="0"
              placeholder="Time to complete agreement"
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
              onUpdate({ agreement: { title, description, payment, duration, duration_units } })
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
