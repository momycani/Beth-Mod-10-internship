import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/checkout.css";
import { auth } from "../firebase";
import { PiStorefront } from "react-icons/pi";
import { FaCreditCard } from "react-icons/fa6";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";

type Plan = "yearly" | "monthly";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const plan = (location.state?.plan as Plan) || "yearly";
  const from = location.state?.from || "/foryou";

  const user = auth.currentUser;

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("United States");
  const [address, setAddress] = useState("");

  const pricing = useMemo(() => {
    if (plan === "yearly") {
      return {
        amount: "$99.99",
        suffix: "per year",
        buttonText: "Start free trial",
        helper: "7-day free trial included",
      };
    }

    return {
      amount: "$9.99",
      suffix: "per month",
      buttonText: "Subscribe",
      helper: "No trial included",
    };
  }, [plan]);

  const [email, setEmail] = useState("");

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setEmail(user?.email || "");
    });

    return unsubscribe;
    }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !expiry || !cvc || !name || !address) {
      alert("Please complete all fields.");
      return;
    }

    const currentUser = auth.currentUser;

if (!currentUser) {
  alert("You must be logged in.");
  return;
}

localStorage.setItem(`isPremium:${currentUser.uid}`, "true");
localStorage.setItem(`premiumPlan:${currentUser.uid}`, plan);

navigate(from, { replace: true });

    // mock successful checkout
    localStorage.setItem("isPremium", "true");
    localStorage.setItem("premiumPlan", plan);

    navigate(from, { replace: true });
  };

  return (
    <div className="checkout-page">
       <div className="checkout-left">
        <button
            type="button"
            className="checkout-topbar"
            onClick={() => navigate(-1)}
            aria-label="Go back"
        >
            <span className="checkout-backArrow">←</span>

            <span className="checkout-brandWrap">
            <span className="checkout-brandDefault">
                <span className="checkout-logoCircle">
                <PiStorefront className="checkout-logoIcon" />
                </span>
                <span className="checkout-brandText">Summarist</span>
            </span>

            <span className="checkout-brandHover">
                <span className="checkout-brandText">Back</span>
            </span>
            </span>

            <span className="checkout-testBadge">TEST MODE</span>
        </button>

        <div className="checkout-priceBlock">
            <p className="checkout-priceBlock__label">
            {plan === "yearly"
                ? "Subscribe to Summarist Premium Plus"
                : "Subscribe to Summarist Premium"}
            </p>

            <div className="checkout-priceRow">
            <span className="checkout-price">
                {plan === "yearly" ? "$99.00" : "$9.99"}
            </span>
            <span className="checkout-priceSuffix">
                {plan === "yearly" ? "per\nyear" : "per\nmonth"}
            </span>
            </div>
        </div>
        </div>

      <div className="checkout-right">
        <form className="checkout-form" onSubmit={handleSubmit}>
            <h2 className="checkout-sectionTitle">Contact information</h2>

        <div className="checkout-contactCard">
        <div className="checkout-contactRow">
            <span className="checkout-contactLabel">Email</span>
            <span className="checkout-contactValue">{email || "No email found"}</span>
        </div>
        </div>

        <h2 className="checkout-sectionTitle">Payment method</h2>

        <div className="checkout-paymentCard">
        <div className="checkout-paymentMethodRow">
            <FaCreditCard className="checkout-paymentMethodIcon" />
            <span className="checkout-paymentMethodText">Card</span>
        </div>

        <div className="checkout-paymentBody">
            <label className="checkout-fieldLabel">Card information</label>

        <div className="checkout-cardGroup">
        <div className="checkout-cardTop">
            <input
            className="checkout-input checkout-input--cardTop"
            type="text"
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            />

            <div className="checkout-cardBrands">
                <FaCcVisa className="card-logo visa" />
                <FaCcMastercard className="card-logo mastercard" />
                <FaCcAmex className="card-logo amex" />
            </div>
        </div>

        <div className="checkout-cardBottom">
            <input
            className="checkout-input checkout-input--cardBottomLeft"
            type="text"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            />

            <div className="checkout-cvcWrap">
            <input
                className="checkout-input checkout-input--cardBottomRight"
                type="text"
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
            />
            <FaCreditCard className="checkout-cvcIcon" />
            </div>
        </div>
        </div>
           

            <label className="checkout-fieldLabel">Cardholder name</label>
            <input
            className="checkout-input"
            type="text"
            placeholder="Full name on card"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <label className="checkout-fieldLabel">Billing address</label>
            <select
            className="checkout-input checkout-input--stackTop"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            >
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            </select>

            <input
            className="checkout-input"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            />

            <button type="button" className="checkout-manualAddress">
            Enter address manually
            </button>
        </div>
        </div>

          <button type="submit" className="checkout-submit">
            {pricing.buttonText}
          </button>
          <div className="checkout-legal">
            <p className="checkout-legal__text">
                Notwithstanding the logo displayed above, when paying with a co-branded
                eftpos debit card, your payment may be processed through either card
                network.
            </p>

            <p className="checkout-legal__text">
                By subscribing, you authorize Summarist to charge you according to the
                terms until you cancel.
            </p>

            <div className="checkout-powered">
                <span>Powered by <strong style={{ letterSpacing: "-0.3px" }}>stripe</strong></span>
                <span className="checkout-powered__divider">|</span>
                <a href="#">Terms</a>
                <a href="#">Privacy</a>
            </div>
            </div>
        </form>
      </div>
    </div>
  );
}