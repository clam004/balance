import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';

const SideNav = () => {
  return (
    <nav className="side-nav-container">
      <div className="side-nav-header">
        <img className="side-nav-logo" src="assets/logo-green.svg" />
        <h3>Balance</h3>
      </div>

      <ul className="side-nav-list">
        {/* TODO: make dynamic */}
        <li className="nav-item active">
          <a href="/dashboard">Current Balances</a>
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
      </ul>
    </nav>
  );
};

export default SideNav;
