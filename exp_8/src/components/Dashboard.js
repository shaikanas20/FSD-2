import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [protectedData, setProtectedData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username") || "User";

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }
  }, [token]);

  const axiosConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const fetchProtectedData = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/protected",
        axiosConfig
      );
      setProtectedData(res.data);
      setSuccess("Protected data fetched successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/profile",
        axiosConfig
      );
      setProfileData(res.data);
      setSuccess("Profile data loaded!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApiError = (err) => {
    if (err.response) {
      if (err.response.status === 403 || err.response.status === 401) {
        setError("Session expired or unauthorized. Redirecting to login...");
        setTimeout(() => {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("username");
          window.location.href = "/";
        }, 2000);
      } else {
        setError(`Error: ${err.response.status} — ${err.response.data.message || "Request failed"}`);
      }
    } else {
      setError("Cannot reach server. Make sure backend is running.");
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, axiosConfig);
    } catch (err) {
      // Logout even if request fails
    }
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    window.location.href = "/";
  };

  // Decode JWT to show token info
  const decodeToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

  const tokenPayload = decodeToken();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (!token) return null;

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar glass-card">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#gradSidebar)" />
              <path d="M12 20L18 14L26 22L18 28L12 20Z" fill="white" fillOpacity="0.9" />
              <path d="M18 14L28 12L26 22L18 14Z" fill="white" fillOpacity="0.6" />
              <defs>
                <linearGradient id="gradSidebar" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#6c63ff" />
                  <stop offset="1" stopColor="#f857a6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="sidebar-title">JWT Auth</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === "protected" ? "active" : ""}`}
            onClick={() => { setActiveTab("protected"); fetchProtectedData(); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Protected Route</span>
          </button>
          <button
            className={`nav-item ${activeTab === "token" ? "active" : ""}`}
            onClick={() => setActiveTab("token")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Token Info</span>
          </button>
          <button
            className={`nav-item ${activeTab === "session" ? "active" : ""}`}
            onClick={() => setActiveTab("session")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span>Session</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{username}</span>
              <span className="status-badge authenticated">
                <span className="status-dot active" />
                Active
              </span>
            </div>
          </div>
          <button className="btn-premium btn-danger-glow logout-btn" onClick={logout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <header className="top-bar">
          <div>
            <h1 className="page-title">{getTimeGreeting()}, {username}!</h1>
            <p className="page-subtitle">JWT Session Dashboard — Experiment 8</p>
          </div>
          <div className="top-bar-actions">
            <span className="status-badge authenticated">
              <span className="status-dot active" />
              Authenticated
            </span>
          </div>
        </header>

        {/* Alerts */}
        {error && (
          <div className="alert-glass error animate-fade-in-up">
            <span className="alert-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert-glass success animate-fade-in-up">
            <span className="alert-icon">✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="tab-content animate-fade-in-up">
          {activeTab === "overview" && (
            <div className="overview-grid">
              <div className="stat-card glass-card" style={{ animationDelay: "0.1s" }}>
                <div className="stat-icon" style={{ background: "rgba(108, 99, 255, 0.15)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Auth Status</h3>
                  <p className="stat-value success-text">Authenticated</p>
                </div>
              </div>

              <div className="stat-card glass-card" style={{ animationDelay: "0.2s" }}>
                <div className="stat-icon" style={{ background: "rgba(248, 87, 166, 0.15)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f857a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Token Expiry</h3>
                  <p className="stat-value">
                    {tokenPayload?.exp
                      ? new Date(tokenPayload.exp * 1000).toLocaleTimeString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="stat-card glass-card" style={{ animationDelay: "0.3s" }}>
                <div className="stat-icon" style={{ background: "rgba(0, 230, 118, 0.15)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Username</h3>
                  <p className="stat-value">{tokenPayload?.sub || username}</p>
                </div>
              </div>

              <div className="stat-card glass-card" style={{ animationDelay: "0.4s" }}>
                <div className="stat-icon" style={{ background: "rgba(255, 171, 64, 0.15)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffab40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Storage</h3>
                  <p className="stat-value">sessionStorage</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "protected" && (
            <div className="protected-section">
              <div className="section-header">
                <h2>Protected Route Response</h2>
                <p className="section-desc">
                  Calls <code>GET /api/auth/protected</code> with JWT Bearer token
                </p>
              </div>
              <div className="action-bar">
                <button
                  className="btn-premium btn-success-glow"
                  onClick={fetchProtectedData}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner" /> Fetching...</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Fetch Protected Data
                    </>
                  )}
                </button>
                <button
                  className="btn-premium btn-primary-glow"
                  onClick={fetchProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner" /> Loading...</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Fetch Profile
                    </>
                  )}
                </button>
              </div>

              {protectedData && (
                <div className="response-card glass-card animate-fade-in-up">
                  <div className="response-header">
                    <span className="response-method">GET</span>
                    <span className="response-url">/api/auth/protected</span>
                    <span className="response-status">200 OK</span>
                  </div>
                  <pre className="response-body">
                    {JSON.stringify(protectedData, null, 2)}
                  </pre>
                </div>
              )}

              {profileData && (
                <div className="response-card glass-card animate-fade-in-up">
                  <div className="response-header">
                    <span className="response-method">GET</span>
                    <span className="response-url">/api/auth/profile</span>
                    <span className="response-status">200 OK</span>
                  </div>
                  <pre className="response-body">
                    {JSON.stringify(profileData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === "token" && (
            <div className="token-section">
              <div className="section-header">
                <h2>JWT Token Details</h2>
                <p className="section-desc">Decoded JWT payload from sessionStorage</p>
              </div>

              {tokenPayload && (
                <div className="token-grid">
                  <div className="token-card glass-card">
                    <h4>📋 Decoded Payload</h4>
                    <pre className="token-json">
                      {JSON.stringify(tokenPayload, null, 2)}
                    </pre>
                  </div>
                  <div className="token-card glass-card">
                    <h4>🔑 Raw Token (Header)</h4>
                    <div className="token-raw">
                      <code className="token-segment header">
                        {token.split(".")[0]}
                      </code>
                      <span className="token-dot">.</span>
                      <code className="token-segment payload">
                        {token.split(".")[1]}
                      </code>
                      <span className="token-dot">.</span>
                      <code className="token-segment signature">
                        {token.split(".")[2]}
                      </code>
                    </div>
                    <div className="token-legend">
                      <span><span className="legend-dot" style={{background: "#6c63ff"}} /> Header</span>
                      <span><span className="legend-dot" style={{background: "#f857a6"}} /> Payload</span>
                      <span><span className="legend-dot" style={{background: "#00e676"}} /> Signature</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "session" && (
            <div className="session-section">
              <div className="section-header">
                <h2>Session Information</h2>
                <p className="section-desc">Current sessionStorage data</p>
              </div>

              <div className="session-grid">
                <div className="session-card glass-card">
                  <div className="session-label">Storage Type</div>
                  <div className="session-value">sessionStorage</div>
                  <div className="session-note">Data persists only for the current browser tab/session</div>
                </div>
                <div className="session-card glass-card">
                  <div className="session-label">Token Key</div>
                  <div className="session-value">"token"</div>
                  <div className="session-note">sessionStorage.getItem("token")</div>
                </div>
                <div className="session-card glass-card">
                  <div className="session-label">Username Key</div>
                  <div className="session-value">"{username}"</div>
                  <div className="session-note">sessionStorage.getItem("username")</div>
                </div>
                <div className="session-card glass-card">
                  <div className="session-label">Token Present</div>
                  <div className="session-value success-text">
                    {token ? "✓ Yes" : "✗ No"}
                  </div>
                  <div className="session-note">Determines access to protected routes</div>
                </div>
              </div>

              <div className="session-actions">
                <h3>Session Actions</h3>
                <div className="action-bar">
                  <button className="btn-premium btn-danger-glow" onClick={logout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Clear Session & Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
