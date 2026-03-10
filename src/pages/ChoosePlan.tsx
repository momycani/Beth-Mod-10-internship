import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { PiPottedPlantFill } from "react-icons/pi";
import { FaHandshake, FaFileAlt } from "react-icons/fa";
import "../styles/chooseplan.css";
import { auth } from "../firebase";

type Plan = "yearly" | "monthly";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQS: FAQItem[] = [
  {
    question: "How does the free 7-day trial work?",
    answer:
      "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
  },
  {
    question: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer:
      "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
  },
  {
    question: "What's included in the Premium plan?",
    answer:
      "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer:
      "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
  },
];

export default function ChoosePlan() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/foryou";
  const [selectedPlan, setSelectedPlan] = useState<Plan>("yearly");
  const [openIndex, setOpenIndex] = useState<number>(0);

  const ctaText = useMemo(() => {
    return selectedPlan === "yearly"
      ? "Start your free 7-day trial"
      : "Start your subscription";
  }, [selectedPlan]);

  const handleContinue = () => {
  navigate("/checkout", {
    state: {
      plan: selectedPlan,
      from,
    },
  });
};

  const ctaTriggerRef = useRef<HTMLDivElement | null>(null);
  const [showStickyCta, setShowStickyCta] = useState(true);

useEffect(() => {
  const handleScroll = () => {
    const trigger = ctaTriggerRef.current;
    if (!trigger) return;

    const triggerTop = trigger.getBoundingClientRect().top;
    const triggerPageTop = window.scrollY + triggerTop;

    const hidePoint = triggerPageTop - window.innerHeight + 140;

    setShowStickyCta(window.scrollY < hidePoint);
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
  if (!auth.currentUser) {
    navigate("/", { replace: true });
  }
}, [navigate]);

const FileIcon = FaFileAlt as React.ElementType;
const HandIcon = FaHandshake as React.ElementType;
const UpIcon = FiChevronUp as React.ElementType;
const DownIcon = FiChevronDown as React.ElementType;
const PlantIcon = PiPottedPlantFill as React.ElementType;

  return (
    <>
    <div className="choose-plan-page">
      <section className="choose-plan-hero">
        <div className="choose-plan-hero__content">
          <h1 className="choose-plan-hero__title">
            Get unlimited access to many amazing books to read
          </h1>
          <p className="choose-plan-hero__subtitle">
            Turn ordinary moments into amazing learning opportunities
          </p>

          <div className="choose-plan-hero__imageWrap">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"
              alt="Reading and learning"
              className="choose-plan-hero__image"
            />
          </div>
        </div>
      </section>

      <section className="choose-plan-benefits container">
        <div className="choose-plan-benefit">
          <FileIcon className="choose-plan-benefit__icon" />
          <p>
            <strong>Key ideas in a few min</strong> with many books to read
          </p>
        </div>

        <div className="choose-plan-benefit">
          <PlantIcon className="choose-plan-benefit__icon" />
          <p>
            <strong>3 million</strong> people growing with Summarist everyday
          </p>
        </div>

        <div className="choose-plan-benefit">
          <HandIcon className="choose-plan-benefit__icon" />
          <p>
            <strong>Precise recommendations</strong> collections curated by
            experts
          </p>
        </div>
      </section>

      <section className="choose-plan-pricing container">
        <h2 className="choose-plan-pricing__title">
          Choose the plan that fits you
        </h2>

        <button
          type="button"
          className={`plan-card ${
            selectedPlan === "yearly" ? "plan-card--active" : ""
          }`}
          onClick={() => setSelectedPlan("yearly")}
          aria-pressed={selectedPlan === "yearly"}
        >
          <div className="plan-card__radio">
            <span
              className={`plan-card__radioDot ${
                selectedPlan === "yearly" ? "plan-card__radioDot--active" : ""
              }`}
            />
          </div>

          <div className="plan-card__content">
            <div className="plan-card__name">Premium Plus Yearly</div>
            <div className="plan-card__price">$99.99/year</div>
            <div className="plan-card__note">7-day free trial included</div>
          </div>
        </button>

        <div className="plan-divider">
          <span className="plan-divider__line" />
          <span className="plan-divider__text">or</span>
          <span className="plan-divider__line" />
        </div>

        <button
          type="button"
          className={`plan-card ${
            selectedPlan === "monthly" ? "plan-card--active" : ""
          }`}
          onClick={() => setSelectedPlan("monthly")}
          aria-pressed={selectedPlan === "monthly"}
        >
          <div className="plan-card__radio">
            <span
              className={`plan-card__radioDot ${
                selectedPlan === "monthly" ? "plan-card__radioDot--active" : ""
              }`}
            />
          </div>

          <div className="plan-card__content">
            <div className="plan-card__name">Premium Monthly</div>
            <div className="plan-card__price">$9.99/month</div>
            <div className="plan-card__note">No trial included</div>
          </div>
        </button>

        <div ref={ctaTriggerRef} className="choose-plan-cta-trigger" />
        <div className="choose-plan-pricing__ctaWrap">
          <button
            type="button"
            className="choose-plan-pricing__cta"
            onClick={handleContinue}
          >
            {ctaText}
          </button>

          <p className="choose-plan-pricing__disclaimer">
            Cancel your trial at any time before it ends, and you won’t be
            charged.
          </p>
        </div>
      </section>

      <section className="choose-plan-faq container">
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div className="faq-item" key={item.question}>
              <button
                type="button"
                className="faq-item__question"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                {isOpen ? <UpIcon /> : <DownIcon />}
              </button>

              {isOpen && <div className="faq-item__answer">{item.answer}</div>}
            </div>
          );
        })}
      </section>

      {showStickyCta && (
        <div className="choose-plan-sticky">
          <button
            type="button"
            className="choose-plan-sticky__button"
            onClick={handleContinue}
          >
            {ctaText}
          </button>
          <p className="choose-plan-sticky__text">
            Cancel your trial at any time before it ends, and you won't be charged.
          </p>
        </div>
      )}
    </div>   
    </>
  );  
}