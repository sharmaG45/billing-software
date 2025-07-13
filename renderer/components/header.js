import React from "react";

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          {/* Logo on the left */}
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="/logos/kodnxt-logo.png"
              alt="Company Logo"
              className="img-fluid"
              style={{ height: "70px", objectFit: "contain" }}
            />
          </a>

          {/* Hamburger button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Navigation links */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link text-white" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/contact">Contact Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/services">Services</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/pricing">Pricing</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
