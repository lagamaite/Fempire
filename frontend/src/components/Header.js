import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav>
        <a href="#services">Services</a>
        <a href="#projects">Projects</a>
        <a href="#about">About</a>
      </nav>
      <button className="contact-button">Contact</button>
    </header>
  );
};

export default Header;
