import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Home.less';

interface HomeProps extends RouteComponentProps<{}> {}

interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    this.state = {};
  }

  signUp() {
    // TODO
    const { history } = this.props;

    return history.push('/signup');
  }

  render() {
    // TODO: try out styled components
    return (
      <div className="splash-container">
        <div className="sidebar-container">
          <img className="sidebar-logo" src="assets/logo-green-large.svg" />
          <h1 className="sidebar-header">Balance</h1>
          <p className="sidebar-text">
            Balance makes it easy to create trustworthy contracts between
            businesses and freelancers
          </p>
          <button
            className="btn-primary signup-btn"
            onClick={this.signUp.bind(this)}
          >
            Sign Up
          </button>
        </div>

        <main className="main-wrapper">
          <nav className="nav-container">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#">About</a>
              </li>
              <li className="nav-item">
                <a href="#">Support</a>
              </li>
              <li className="nav-item">
                <a href="/login">Log In</a>
              </li>
            </ul>
          </nav>

          <div className="about-container">
            <section className="about-section">
              <div className="about-logo-container">
                <img className="about-logo" src="assets/about-logo.svg" />
              </div>

              <div className="about-content">
                <h4>What is Balance?</h4>
                <p>
                  Balance is an easy and trustworthy way to make a contract with
                  someone for a job or comission. Too often are contracts
                  between individuals difficult to resolve, and balance helps
                  both sides build sincere collaborations.
                </p>
              </div>
            </section>

            <section className="about-section">
              <div className="about-graphic">Placeholder</div>
            </section>

            <section className="about-section">
              <div className="about-logo-container">
                <img className="about-logo" src="assets/about-logo.svg" />
              </div>

              <div className="about-content">
                <h4>How does Balance work?</h4>
                <p>
                  Balance encourages mutual goodwill by asking the creator and
                  executor of the contract to make a comittment via a stake, if
                  everything goes well the stake is returned to the parties
                  involved. Otherwise a portion of the stake is used to
                  arbitrate a decision.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }
}

export default Home;
