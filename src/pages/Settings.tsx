import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import "../styles/settings.css";

type SubscriptionPlan = "basic" | "premium-plus";

export default function Settings({
    onRequireLogin,
  }: {
    onRequireLogin: (redirectPath?: string) => void;
  }) {

  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // replace this later with real subscription data from Firestore / backend
  const [plan, setPlan] = useState<SubscriptionPlan>("basic");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      // TEMP:
      // Example logic so you can test both states.
      // Replace with your real subscription source later.
      const storedPlan =
        (localStorage.getItem("subscriptionPlan") as SubscriptionPlan | null) ??
        "basic";

      setPlan(storedPlan);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpgrade = () => {
    navigate("/choose-plan");
  };

  const handleManageBilling = async () => {
    try {
      // Later this should call your backend / Stripe portal endpoint
      // Example:
      // const res = await fetch("/api/create-customer-portal-session", { method: "POST" });
      // const data = await res.json();
      // window.location.href = data.url;

      alert("Connect this button to your Stripe Customer Portal.");
    } catch (error) {
      console.error("Manage billing error:", error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      // Later this should call your backend to cancel subscription
      // or redirect them to Stripe Customer Portal.
      alert("You can connect this to Stripe Customer Portal or your cancel flow.");
    } catch (error) {
      console.error("Cancel subscription error:", error);
    }
  };

  if (loading) {
    return (
      
          <main className="page-content">
            <section className="settings-page">
              <h1 className="settings-title">Settings</h1>
              <div className="settings-divider" />
              <p>Loading...</p>
            </section>
          </main>
        
    );
  }

  return (
    

        <main className="page-content">
          <section className="settings-page">
            <h1 className="settings-title">Settings</h1>
            <div className="settings-divider" />

            {!user ? (
              <div className="settings-empty">
                <img
                  src="/assets/login.png"
                  alt="Login required"
                  className="settings-empty__image"
                />
                <h2 className="settings-empty__title">
                  Log in to your account to see your details.
                </h2>
                <button
                  className="settings-btn settings-btn--primary"
                  onClick={() => onRequireLogin("/settings")}
                >
                  Log In
                </button>
              </div>
            ) : (
              <div className="settings-sections">
                <section className="settings-card">
                  

                  <div className="settings-row">
                    <div className="settings-label">Email</div>
                    <div className="settings-value">{user.email || "No email found"}</div>
                  </div>
                </section>

                <section className="settings-card">
                  

                  <div className="settings-row">
                    <div className="settings-label">Your Subscription plan</div>
                    <div className="settings-value">
                      {plan === "premium-plus" ? "premium-plus" : "Basic"}
                    </div>
                  </div>

                  {plan === "premium-plus" ? (
                    <div className="settings-actions">
                      <button
                        className="settings-btn settings-btn--primary"
                        onClick={handleManageBilling}
                      >
                        Manage Billing
                      </button>

                      <button
                        className="settings-btn settings-btn--danger"
                        onClick={handleCancelSubscription}
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  ) : (
                    <section className="settings-card settings-card--upgrade">
                      <div className="settings-upgrade">

                        <div className="settings-upgrade__top">
                          <div>
                            <p className="settings-upgrade__eyebrow">Upgrade Available</p>
                            <h2 className="settings-upgrade__title">Upgrade to Premium</h2>
                            <p className="settings-upgrade__text">
                              Unlock full access to premium book summaries, audio, and more.
                            </p>
                          </div>

                          <div className="settings-plan-badge">Basic</div>
                        </div>

                        <div className="settings-upgrade__features">
                          <div className="settings-feature">
                            Unlimited access to premium content
                          </div>

                          <div className="settings-feature">
                            Listen to audio versions
                          </div>

                          <div className="settings-feature">
                            Continue reading across your library
                          </div>
                        </div>

                        <div className="settings-upgrade__actions">
                          <button
                            className="settings-btn settings-btn--upgrade"
                            onClick={handleUpgrade}
                          >
                            Upgrade to Premium
                          </button>
                        </div>

                      </div>
                    </section>
                  )}
                </section>
              </div>
            )}
          </section>
        </main>
   
  );
}