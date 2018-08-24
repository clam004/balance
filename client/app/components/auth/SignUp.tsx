import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { get } from 'lodash';
import { signup } from '../../helpers/auth';
import './Auth.less';

interface SignUpState {
  email: string;
  password: string;
  passwordConfirmation: string;
  error?: string;
}

class SignUp extends React.Component<RouteComponentProps<{}>, SignUpState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      email: '',
      password: '',
      passwordConfirmation: '',
      error: null
    };
  }

  onUpdateInput(e: any) {
    const { name, value } = e.target;

    return this.setState({
      [name]: value
    } as Pick<SignUpState, keyof SignUpState>);
  }

  handleSubmit(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    const { history } = this.props;
    const { email, password, passwordConfirmation } = this.state;

    if (!email) {
      return this.setState({ error: 'A valid email is required!' });
    } else if (!password) {
      return this.setState({ error: 'A password is required!' });
    } else if (password !== passwordConfirmation) {
      return this.setState({
        error: 'Password does not match password confirmation!'
      });
    }

    return signup({ email, password })
      .then(() => history.push('/login'))
      .catch(err => {
        const error = get(err, 'message', 'Invalid credentials!');

        this.setState({ error });
      });
  }

  render() {
    return (
      <div className="sign-in-wrapper">
        <div className="sign-in-container">
          <div className="sign-in-box">
            <div className="sign-in-header">
              <h4>Create Balance Account</h4>
            </div>

            <form
              className="sign-in-form"
              onSubmit={this.handleSubmit.bind(this)}
            >
              <div className="form-group">
                <label className="label-default">Enter Email</label>

                <input
                  type="email"
                  className="input-default full-width"
                  placeholder="Email Address"
                  name="email"
                  value={this.state.email}
                  onChange={this.onUpdateInput.bind(this)}
                />
              </div>

              <div className="form-group">
                <label className="label-default">Enter Password</label>

                <input
                  style={{ marginBottom: 8 }}
                  type="password"
                  className="input-default full-width"
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onUpdateInput.bind(this)}
                />

                <input
                  type="password"
                  className="input-default full-width"
                  placeholder="Confirm Password"
                  name="passwordConfirmation"
                  value={this.state.passwordConfirmation}
                  onChange={this.onUpdateInput.bind(this)}
                />
              </div>
            </form>
          </div>

          <button
            className="btn-primary btn-sign-in"
            type="submit"
            onClick={this.handleSubmit.bind(this)}
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }
}

export default SignUp;
