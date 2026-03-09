import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignUpModal({ open, onClose, onGoToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const getRedirectPath = () => {
  const savedPath = localStorage.getItem("postAuthRedirect");
  if (savedPath) {
    localStorage.removeItem("postAuthRedirect");
    return savedPath;
  }
  return "/foryou";
};

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      await signInWithPopup(auth, googleProvider);
      localStorage.removeItem("isGuest");
      const redirectTo = getRedirectPath();
      onClose();

      navigate("/foryou", {
        state: { successMessage: "Signup successful!" },
      });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Google sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = {
  length: password.length >= 6,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[^A-Za-z\d]/.test(password),
};

  const handleEmailSignup = async () => {
    if (!email.trim() || !password) {
    setError("Please enter your email and password.");
    return;
  }
    try {
      setLoading(true);
      setError("");

      await createUserWithEmailAndPassword(auth, email.trim(), password);
      localStorage.removeItem("isGuest");
      const redirectTo = getRedirectPath();
      onClose();

      if (
        !passwordRules.length ||
        !passwordRules.uppercase ||
        !passwordRules.lowercase ||
        !passwordRules.number ||
        !passwordRules.special
      ) {
        setError("Please meet all password requirements.");
        return;
      }

      navigate("/foryou", {
        state: { successMessage: "Signup successful!" },
      });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };  

  return createPortal(
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true"
        aria-label="Sign up">
        <button className="modalClose" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="modalTitle">Sign up to Summarist</h2>

        <button type="button" onClick={handleGoogleSignup} disabled={loading}
          className="relative flex items-center justify-center w-full h-12 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
          <span className="absolute left-3 bg-white w-8 h-8 flex items-center justify-center rounded">
            <FcGoogle className="text-lg" />
          </span>
          <span className="font-medium">
            {loading ? "Signing up..." : "Sign up with Google"}
          </span>
        </button>

        <div className="dividerRow">
          <span className="dividerLine" />
          <span className="dividerText">or</span>
          <span className="dividerLine" />
        </div>

        <input className="modalInput" type="email" placeholder="Email Address" value={email}
          onChange={(e) => setEmail(e.target.value)} disabled={loading} />

        <div className="password-input-wrapper">
          <input 
            className="modalInput"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>     

        <ul className="password-rules">
          <li className={passwordRules.length ? "valid" : ""}>
            Minimum 6 characters
          </li>
          <li className={passwordRules.uppercase ? "valid" : ""}>
            1 uppercase letter
          </li>
          <li className={passwordRules.lowercase ? "valid" : ""}>
            1 lowercase letter
          </li>
          <li className={passwordRules.number ? "valid" : ""}>
            1 number
          </li>
          <li className={passwordRules.special ? "valid" : ""}>
            1 special character
          </li>
        </ul>

        {error && <p className="modalError">{error}</p>}

        <button
          type="button"
          onClick={handleEmailSignup}
          className="modalPrimaryBtn"
          disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <div className="mt-6 -mx-6 border-t border-slate-200 rounded-b-xl bg-slate-50 py-4">
          <button
            onClick={onGoToLogin}
            className="w-full text-center text-sm font-light text-blue-500 hover:text-blue-600 transition">
            Already have an account?
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}