import * as React from 'react';

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
          <a href="/dashboard">History</a>
        </li>
        <li className="nav-item">
          <a href="/dashboard">Arbitrations</a>
        </li>
        <li className="nav-item">
          <a href="/dashboard">Support</a>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
