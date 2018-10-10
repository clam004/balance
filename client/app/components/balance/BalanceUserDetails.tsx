import * as React from 'react';
import { getusers } from '../../helpers/transactions';

interface State {
  email: string;
  phone: string;
  isLoading: boolean;
  search_users: Object;
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
      phone: '',
      isLoading: false,
      search_users: []
    };
  }

  componentDidMount() {
    
    this.setState({ isLoading: true });
    getusers()
      .then(user_data => {
        this.setState({search_users:user_data, isLoading: false}), console.log(user_data)
      });
  }

  render() {

    const { search_users, isLoading } = this.state;
    const { email, phone } = this.state;
    const { onSelectUser, onInvite } = this.props;

   if (Array.isArray(search_users) && search_users.length >0) {
      const users = search_users;


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
                  <div className="favorite-user-name">{user.username}</div>
                  <div className="favorite-user-details">
                    {user.num_completed_balances} successful contracts
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

    } else {
      return (<div> Loading ... </div>)
    }

  }
}

export default BalanceUserDetails;


    /*
    if (Array.isArray(search_users) && search_users.length >0) {
      const users = search_users;
    } else {
      // test data
      const users = [
        { username: 'Toro the Shiba', num_completed_balances: 12 },
        { username: 'Boro the Shizu', num_completed_balances: 8 },
        { username: 'Bobo the Corgi', num_completed_balances: 10 }
      ]
    }

    const users = [
      { name: 'Toro the Shiba', successes: 12 },
      { name: 'Boro the Shizu', successes: 8 },
      { name: 'Bobo the Corgi', successes: 10 }
    ]

    */
