import * as React from 'react';

const NavBar = () => {
  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li className="nav-item">
          <a href="#">About</a>
        </li>
        <li className="nav-item">
          <a href="#">Support</a>
        </li>
        <li className="nav-item">
          <a href="#">Sign In</a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
