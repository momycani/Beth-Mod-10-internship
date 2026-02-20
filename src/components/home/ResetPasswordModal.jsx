import { useState } from "react";
import { createPortal } from "react-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

export default function ResetPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleReset = async () => {
    if (!email) return;

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modalClose" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="modalTitle">Reset your password</h2>

        <input
          className="modalInput"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleReset} disabled={loading} className="modalPrimaryBtn">
          {loading ? "Sending..." : "Send reset password link"}
        </button>

        <button onClick={onClose} className="modalLink">
          Go to login
        </button>
      </div>
    </div>,
    document.body
  );
}
