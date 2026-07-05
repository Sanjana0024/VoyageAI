import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
  };

  const loginWithEmail = async () => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
  };

  return (
    <div className="p-10 max-w-md mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Login to VoyageAI</h1>

      <button
        onClick={loginWithGoogle}
        className="w-full bg-red-500 text-white py-2 rounded mb-4"
      >
        Continue with Google
      </button>

      <input
        className="w-full border p-2 mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border p-2 mb-2"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={loginWithEmail}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Login with Email
      </button>
    </div>
  );
}