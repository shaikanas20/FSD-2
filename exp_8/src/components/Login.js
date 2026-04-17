import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      if (res.data.token) {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("username", res.data.username || username);
        window.location.href = "/dashboard";
      } else {
        setError("Login failed. No token received.");
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message ||
            `Authentication failed (${err.response.status})`
        );
      } else if (err.request) {
        setError("Cannot reach server. Make sure backend is running on port 5000.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Floating particles */}
      <div className="particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>

      <div className="login-container animate-fade-in-up">
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="brand-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#grad)" />
              <path
                d="M12 20L18 14L26 22L18 28L12 20Z"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M18 14L28 12L26 22L18 14Z"
                fill="white"
                fillOpacity="0.6"
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#6c63ff" />
                  <stop offset="1" stopColor="#f857a6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="brand-title">JWT Auth</h1>
          <p className="brand-subtitle">Secure Session Authentication</p>
        </div>

        {/* Login Card */}
        <div className="login-card glass-card">
          <div className="card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="alert-glass error">
              <span className="alert-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={login} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  className="premium-input with-icon"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="premium-input with-icon"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-premium btn-primary-glow login-btn"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials</p>
            <div className="credential-chips">
              <button
                type="button"
                className="credential-chip"
                onClick={() => {
                  setUsername("user123");
                  setPassword("password123");
                }}
              >
                <span className="chip-role">USER</span>
                <span className="chip-user">user123</span>
              </button>
              <button
                type="button"
                className="credential-chip"
                onClick={() => {
                  setUsername("admin");
                  setPassword("admin123");
                }}
              >
                <span className="chip-role admin">ADMIN</span>
                <span className="chip-user">admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="login-footer">
          Experiment 8 — Frontend Integration with JWT APIs
        </p>
      </div>
    </div>
  );
}

export default Login;
