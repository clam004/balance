import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { logout, getUserData, isLoggedIn } from '../../helpers/auth';

const SideNav = () => {
  return (
    <nav className="side-nav-container">
      <div className="side-nav-header">
        <img className="side-nav-logo" src="assets/logo-green.svg" />
        <h3>Balance</h3>
      </div>

      <ul className="side-nav-list">
        {/* TODO: make dynamic */}
        <li className="nav-item">
          <Link to="/buying-balances">Buying Balances</Link>
        </li>
        <li className="nav-item">
          <Link to="/selling-balances">Selling Balances</Link>
        </li>
        <li className="nav-item">
          <a href="/history">History</a>
        </li>
        <li className="nav-item">
          <a href="/dashboard">Arbitrations</a>
        </li>
        <li className="nav-item">
          <Link to="/myaccount">My Account</Link>
        </li>
        <li className="nav-item">
          <a href="/dashboard">Support</a>
        </li>
        <li className="nav-item">
          <Link onClick={() => logout()} to="/">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
