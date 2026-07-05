import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcI66kqE6tHg9mf8MWwtbD95m_tTWFXcQ",
  authDomain: "voyageai-5ca9a.firebaseapp.com",
  projectId: "voyageai-5ca9a",
  appId: "1:223768614088:web:dbcb2b3752f9cf4e1601fd",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();