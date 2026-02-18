import { useState } from "react";
import { createPortal } from "react-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

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
      <div
        className="modalCard w-full max-w-sm p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-lg font-semibold text-center mb-4">
          Reset your password
        </h2>

        <input
          className="input mb-4"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full h-10 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition"
        >
          {loading ? "Sending..." : "Send reset password link"}
        </button>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-blue-500 w-full text-center"
        >
          Go to login
        </button>
      </div>
    </div>,
    document.body
  );
}
