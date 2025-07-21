import { useState } from "react";
import { supabase } from "../../supabaseClient";
import "./css/Auth.css"; // CSSファイルを読み込み

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setMessage(
      error ? error.message : isSignUp ? "Check your email to confirm!" : "Logged in!"
    );
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">{isSignUp ? "Sign Up" : "Log In"}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
      />
      <button onClick={handleSubmit} className="auth-button">
        {isSignUp ? "Sign Up" : "Log In"}
      </button>
      <p className="auth-message">{message}</p>
      <button onClick={() => setIsSignUp(!isSignUp)} className="auth-toggle">
        {isSignUp
          ? "Already have an account? Log In"
          : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};

export default Auth;
