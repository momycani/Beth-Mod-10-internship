import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../../firebase"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import ResetPasswordModal from "./ResetPasswordModal";

export default function LoginModal({ open, onClose, onOpenSignUp }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
  setError("");

  if (!email.trim() || !password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email.trim(), password);
    onClose();
  } catch (err) {
    // Firebase error codes -> friendly message
    const code = err?.code || "";
    if (code === "auth/user-not-found") setError("No account found for that email.");
    else if (code === "auth/wrong-password") setError("Incorrect password.");
    else if (code === "auth/invalid-email") setError("Please enter a valid email address.");
    else setError(err?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
  // Close on ESC + lock body scroll
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const navigate = useNavigate();

  const [resetOpen, setResetOpen] = useState(false);

  const handleGuestLogin = () => {
  onClose();          // close the modal
  navigate("/for-you");  // go to ForYou page
};

  if (!open) return null;

  const handleGoogleLogin = async () => {
  console.log("Google login clicked"); // <-- quick sanity check

  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Signed in user:", result.user);
    onClose();
  } catch (err) {
    console.error("Google sign-in error:", err);
    alert(err?.message ?? "Google sign-in failed"); // temporary
  }
  }; 

  return createPortal(
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="modalCard w-full max-w-md" onMouseDown={(e) => {
          e.stopPropagation();     // keep modal open
          if (error) setError(""); // clear error on any click inside
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Log in">
        <button className="modalClose" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="modalTitle">Log in to Summarist</h2>
        {error && (
          <div className="mt-3 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        <button onClick={handleGuestLogin} className="relative flex items-center justify-center w-full h-12 rounded-lg bg-blue-800 text-white hover:bg-blue-900 transition">
          <FaUser className="absolute left-4 text-lg" />
          <span className="font-medium">
            Login as Guest
          </span>
        </button>
        <div className="dividerRow">
          <span className="dividerLine" />
          <span className="dividerText">or</span>
          <span className="dividerLine" />
        </div>
        <button onClick={handleGoogleLogin} className="relative flex items-center justify-center w-full h-12 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">            
          <span className="absolute left-3 bg-white w-8 h-8 flex items-center justify-center rounded">
            <FcGoogle className="text-lg" />
          </span>          
          <span className="font-medium">
            Login with Google
          </span>
        </button>
        <div className="dividerRow">
          <span className="dividerLine" />
          <span className="dividerText">or</span>
          <span className="dividerLine" />
        </div>
        <input className="modalInput" placeholder="Email Address" value={email} onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
        />
        <input className="modalInput" placeholder="Password" type="password" value={password} onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
        />        
        <button onClick={handleEmailLogin} disabled={loading}
          className="modalPrimaryBtn">
          {loading ? "Logging in..." : "Login"}
        </button>

        <button onClick={() => setResetOpen(true)}
          className="mt-6 text-sm font-light text-blue-400 hover:text-blue-500 transition text-center w-full">
          Forgot your password?
        </button>
        <div className="mt-6 -mx-6 border-t border-slate-200 rounded-b-xl bg-slate-50 py-4">
          <button onClick={() => {
              onClose();
              onOpenSignUp();
            }}
            className="w-full text-center text-sm font-light text-blue-500 hover:text-blue-600 transition">
            Don't have an account?
          </button>
        </div>
      </div>
      <ResetPasswordModal 
       open={resetOpen}
       onClose={() => setResetOpen(false)}
      />
    </div>,
    document.body
  );
}
