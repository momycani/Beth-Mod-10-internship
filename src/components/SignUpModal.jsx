import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function SignUpModal({ open, onClose, onGoToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Signed up with Google:", result.user);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Google sign up failed");
    }
  };

  const handleEmailSignup = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up with email:", result.user);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Sign up failed");
    }
  };

  return createPortal(
    <div className="modalOverlay" onMouseDown={onClose}>
      <div
        className="modalCard w-full max-w-md p-6 relative"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Sign up"
      >
        <button className="modalClose" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="modalTitle">Sign up to Summarist</h2>

        <button
          onClick={handleGoogleSignup}
          className="relative flex items-center justify-center w-full h-12 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          <span className="absolute left-3 bg-white w-8 h-8 flex items-center justify-center rounded">
            <FcGoogle className="text-lg" />
          </span>
          <span className="font-medium">Sign up with Google</span>
        </button>

        <div className="dividerRow">
          <span className="dividerLine" />
          <span className="dividerText">or</span>
          <span className="dividerLine" />
        </div>

        <input
          className="input"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input mt-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleEmailSignup}
          className="mt-4 w-full h-12 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
        >
          Sign up
        </button>

        {/* Footer strip like your screenshot */}
        <div className="mt-6 -mx-6 border-t border-slate-200 rounded-b-xl bg-slate-50 py-4">
          <button
            onClick={onGoToLogin}
            className="w-full text-center text-sm font-light text-blue-500 hover:text-blue-600 transition"
          >
            Already have an account?
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

