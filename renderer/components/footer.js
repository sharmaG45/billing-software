import React from "react";

export default function Footer() {
  return (
    <footer className="bg-light py-5">
      <div className="container">
        <div className="row text-center text-md-start">
          
          {/* Column 1 */}
          <div className="col-md-4 mb-4">
            <img
              src="/logo/kodnxt-logo.png" // Replace with your logo path
              alt="Company Logo"
              style={{ height: "60px" }}
              className="mb-2"
            />
            <h5 className="mb-2">KodNxt AdTech</h5>
            <p className="small text-muted">
              We are committed to delivering the best products and services with a focus on quality and customer satisfaction.
            </p>

            
          </div>

          {/* Column 2 - Two social media icons */}
          <div className="col-md-4 mb-4 d-flex flex-column align-items-center justify-content-center">
            <h5 className="mb-3">Follow Us</h5>
            <div className="d-flex gap-4 fs-3">
             <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-dark fs-5">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-dark fs-5">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-dark fs-5">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-dark fs-5">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            </div>
          </div>

          {/* Column 3 - Navigation Links */}
          <div className="col-md-4 mb-4 text-center text-md-start">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-decoration-none text-dark">
                  Home
                </a>
              </li>
              <li>
                <a href="/contact" className="text-decoration-none text-dark">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/services" className="text-decoration-none text-dark">
                  Services
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-decoration-none text-dark">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

        </div>

        <hr />

        <div className="text-center small text-muted mt-3">
          &copy; {new Date().getFullYear()} KodNxt AdTech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
