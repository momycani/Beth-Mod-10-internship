import React from "react"; 
import { Link } from "react-router-dom";
import "../../styles/style.css";

export default function Footer() {
  return (
    <section id="footer">
      <div className="container">
        <div className="row">
          <div className="footer__top--wrapper">
            <div className="footer__block">
              <div className="footer__link--title">Actions</div>
              <div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Summarist Magazine</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Cancel Subscription</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Help</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Contact us</Link>
                </div>
              </div>
            </div>

            <div className="footer__block">
              <div className="footer__link--title">Useful Links</div>
              <div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/choose-plan">Pricing</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Summarist Business</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Gift Cards</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Authors & Publishers</Link>
                </div>
              </div>
            </div>

            <div className="footer__block">
              <div className="footer__link--title">Company</div>
              <div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">About</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Careers</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Partners</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Code of Conduct</Link>
                </div>
              </div>
            </div>

            <div className="footer__block">
              <div className="footer__link--title">Other</div>
              <div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Sitemap</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Legal Notice</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Terms of Service</Link>
                </div>
                <div className="footer__link--wrapper">
                  <Link className="footer__link" to="/">Privacy Policies</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="footer__copyright--wrapper">
            <div className="footer__copyright">
              Copyright © 2023 Summarist.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}