
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth, googleProvider } from "../firebase";
import "../App.css";

export default function Login({
  mode = "login",
  setMode = () => {},
  onClose = () => {},
  setUser = () => {},
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        await updateProfile(result.user, {
          displayName: name.trim(),
        });

        setUser(result.user);
      } else {
        const result = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        setUser(result.user);
      }

      onClose();
    } catch (err) {
      const messages = {
        "auth/email-already-in-use":
          "This email is already registered. Please sign in.",
        "auth/invalid-email":
          "Please enter a valid email address.",
        "auth/invalid-credential":
          "Incorrect email or password. Please try again.",
        "auth/weak-password":
          "Choose a stronger password with at least 6 characters.",
        "auth/operation-not-allowed":
          "This sign-in method is disabled in Firebase Console.",
        "auth/popup-closed-by-user":
          "The Google sign-in window was closed before completion.",
        "auth/popup-blocked":
          "Your browser blocked the sign-in popup. Allow popups and try again.",
        "auth/network-request-failed":
          "Network error. Check your internet connection.",
      };

      setError(
        messages[err.code] ||
          err.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      onClose();
    } catch (err) {
      const messages = {
        "auth/popup-closed-by-user":
          "The Google sign-in window was closed.",
        "auth/popup-blocked":
          "Allow popups in your browser and try again.",
        "auth/operation-not-allowed":
          "Enable Google sign-in in Firebase Console.",
        "auth/network-request-failed":
          "Network error. Check your internet connection.",
      };

      setError(
        messages[err.code] ||
          err.message ||
          "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="voyage-auth-page">
      <section className="voyage-auth-visual">
        <button
          className="voyage-auth-brand"
          onClick={onClose}
          type="button"
        >
          ✦ VoyageAI
        </button>

        <div className="voyage-auth-visual-content">
          <span>YOUR NEXT ADVENTURE STARTS HERE</span>
          <h1>
            The world is
            <br />
            <em>closer than ever.</em>
          </h1>
          <p>
            Discover inspiring places and create journeys
            designed around you with your AI travel companion.
          </p>
        </div>

        <span className="voyage-auth-photo-caption">
          Collect moments, not just miles.
        </span>
      </section>

      <section className="voyage-auth-form-section">
        <button
          type="button"
          className="voyage-auth-back"
          onClick={onClose}
        >
          ← Back to homepage
        </button>

        <div className="voyage-auth-card">
          <span className="voyage-auth-symbol">✦</span>

          <p className="voyage-eyebrow">
            YOUR JOURNEY, YOUR WAY
          </p>

          <h2>
            {isRegister ? "Create your account" : "Welcome back"}
          </h2>

          <p className="voyage-auth-subtitle">
            {isRegister
              ? "Join VoyageAI and start planning your next escape."
              : "Sign in to continue your travel planning journey."}
          </p>

          <button
            type="button"
            className="voyage-google-button"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <span className="voyage-google-g">G</span>
            Continue with Google
          </button>

          <div className="voyage-auth-divider">
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleEmailAuth}>
            {isRegister && (
              <label className="voyage-auth-label">
                Full name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label className="voyage-auth-label">
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="voyage-auth-label">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                minLength={6}
                required
              />
            </label>

            {error && (
              <p className="voyage-auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="voyage-btn voyage-btn-orange voyage-auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait…"
                : isRegister
                  ? "Create account →"
                  : "Sign in →"}
            </button>
          </form>

          <p className="voyage-auth-switch">
            {isRegister
              ? "Already have an account?"
              : "New to VoyageAI?"}{" "}
            <button
              type="button"
              onClick={() => {
                setError("");
                setMode(isRegister ? "login" : "register");
              }}
              disabled={loading}
            >
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </p>

          <p className="voyage-auth-terms">
            By continuing, you agree to use VoyageAI responsibly.
          </p>
        </div>
      </section>
    </main>
  );
}
