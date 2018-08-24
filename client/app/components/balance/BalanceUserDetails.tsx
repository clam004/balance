import * as React from 'react';

interface State {
  email: string;
  phone: string;
}

interface Props {
  onSelectUser: (updates: any) => void;
  onInvite: (invite: any) => void;
}

class BalanceUserDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      phone: ''
    };
  }

  render() {
    const { email, phone } = this.state;
    const { onSelectUser, onInvite } = this.props;
    const users = [
      { name: 'Toro the Shiba', successes: 12 },
      { name: 'Boro the Shizu', successes: 8 },
      { name: 'Bobo the Corgi', successes: 10 }
    ];

    return (
      <div>
        <h4 className="new-balance-detail-header">Favorites</h4>

        {/* TODO */}
        <div style={{ paddingLeft: 16, paddingRight: 16 }}>
          <div className="balance-alert">
            <div className="alert-text text-bold">
              Find Balancers in your email
            </div>
            <div className="alert-description text-sm">
              We can help automatically find other balancers to add to your
              favorites by connecting to Gmail.
            </div>
            <div className="alert-action text-sm text-bold">
              Connect Balance to Gmail
            </div>
          </div>

          {users.map((user, key) => {
            return (
              <div
                key={key}
                className="favorite-user-card"
                onClick={() => onSelectUser({ seller: user })}
              >
                <div className="favorite-user-photo">{/* TODO */}</div>
                <div>
                  <div className="favorite-user-name">{user.name}</div>
                  <div className="favorite-user-details">
                    {user.successes} successful contracts
                  </div>
                </div>
                <div className="favorite-user-selector">Select</div>
                {/* TODO: arrow icon */}
              </div>
            );
          })}
        </div>

        <h4 className="new-balance-detail-header">Invite someone new</h4>

        <div style={{ paddingLeft: 16, paddingRight: 16 }}>
          <div className="form-group">
            <label className="label-default">Email Address</label>
            <input
              className="input-default full-width"
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label-default">Phone Number</label>
            <input
              className="input-default full-width"
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={e => this.setState({ phone: e.target.value })}
            />
          </div>

          <button
            className="btn-primary full-width"
            onClick={() => onInvite({ email, phone })}
          >
            <img src="assets/btn-logo-1.svg" style={{ marginRight: 16 }} />
            Invite to Balance
          </button>
        </div>
      </div>
    );
  }
}

export default BalanceUserDetails;
