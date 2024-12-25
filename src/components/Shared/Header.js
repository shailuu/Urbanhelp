import React from 'react';
import './Header.css';
import logo from '../../assets/images/assets.jpg';

function Header() {
  return (
    <header className="header">
      <img src={logo} alt="UrbanHelp Logo" className="header-logo" />
      <h1 className="header-title">UrbanHelp</h1>
    </header>
  );
}

export default Header;
