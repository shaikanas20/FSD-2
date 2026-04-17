import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  Snackbar,
  Avatar,
  Divider,
} from "@mui/material";
import {
  PersonOutlined,
  LogoutOutlined,
  SecurityOutlined,
  AdminPanelSettingsOutlined,
  DashboardOutlined,
  InfoOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";

function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [adminLoading, setAdminLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const user = sessionStorage.getItem("user");
  const role = sessionStorage.getItem("role");
  const password = sessionStorage.getItem("password");

  useEffect(() => {
    if (!role || !user) {
      navigate("/");
      return;
    }
    if (role !== "ROLE_ADMIN") {
      alert("Access Denied — ADMIN role required");
      navigate("/");
    }
  }, [role, user, navigate]);

  const fetchAdminDashboard = async () => {
    setAdminLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/admin/dashboard", {
        auth: { username: user, password: password },
      });
      setAdminData(res.data);
      setSnackbar({ open: true, message: "Admin dashboard data loaded!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to load admin data", severity: "error" });
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/user/profile", {
        auth: { username: user, password: password },
      });
      setProfileData(res.data);
      setSnackbar({ open: true, message: "User profile data loaded!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to load profile data", severity: "error" });
    } finally {
      setProfileLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  if (!role || role !== "ROLE_ADMIN") return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #24243e 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 4,
          py: 2,
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <SecurityOutlined sx={{ color: "#6366f1", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
            RBAC Portal
          </Typography>
          <Chip
            label="ADMIN"
            size="small"
            sx={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            icon={<AdminPanelSettingsOutlined sx={{ color: "#fbbf24 !important" }} />}
            label={`${user} · ADMIN`}
            sx={{
              background: "rgba(251,191,36,0.12)",
              color: "#fbbf24",
              border: "1px solid rgba(251,191,36,0.25)",
              fontWeight: 600,
            }}
          />
          <Button
            onClick={logout}
            startIcon={<LogoutOutlined />}
            sx={{
              color: "#f87171",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "rgba(239,68,68,0.1)",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                fontSize: "1.4rem",
                fontWeight: 700,
              }}
            >
              {user?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#fff", lineHeight: 1.2 }}
              >
                Admin Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mt: 0.5 }}>
                Welcome, <strong style={{ color: "#fbbf24" }}>{user}</strong> — you have{" "}
                <Chip
                  label="FULL ACCESS"
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.2) 100%)",
                    color: "#fbbf24",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    height: 22,
                    border: "1px solid rgba(251,191,36,0.3)",
                  }}
                />{" "}
                privileges
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 4 }}>
          {/* Admin Dashboard Card */}
          <Card
            sx={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                border: "1px solid rgba(239,68,68,0.3)",
                boxShadow: "0 12px 30px rgba(239,68,68,0.1)",
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <AdminPanelSettingsOutlined sx={{ color: "#f87171" }} />
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                  Admin Panel
                </Typography>
                <Chip
                  label="ADMIN ONLY"
                  size="small"
                  sx={{
                    background: "rgba(239,68,68,0.15)",
                    color: "#f87171",
                    fontWeight: 700,
                    fontSize: "0.6rem",
                    height: 20,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 3 }}>
                Fetch admin data from <code style={{ color: "#f87171" }}>/api/admin/dashboard</code>
              </Typography>
              <Button
                variant="contained"
                onClick={fetchAdminDashboard}
                disabled={adminLoading}
                startIcon={<AdminPanelSettingsOutlined />}
                sx={{
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 6px 20px rgba(239,68,68,0.3)",
                  "&:hover": {
                    boxShadow: "0 8px 25px rgba(239,68,68,0.4)",
                  },
                }}
              >
                {adminLoading ? "Loading..." : "Get Admin Data"}
              </Button>
            </CardContent>
          </Card>

          {/* User Profile Card */}
          <Card
            sx={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                border: "1px solid rgba(34,197,94,0.3)",
                boxShadow: "0 12px 30px rgba(34,197,94,0.1)",
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <DashboardOutlined sx={{ color: "#4ade80" }} />
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                  User Profile
                </Typography>
                <Chip
                  label="ALL ROLES"
                  size="small"
                  sx={{
                    background: "rgba(34,197,94,0.15)",
                    color: "#4ade80",
                    fontWeight: 700,
                    fontSize: "0.6rem",
                    height: 20,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 3 }}>
                Fetch profile from <code style={{ color: "#4ade80" }}>/api/user/profile</code> — Admin can also access
              </Typography>
              <Button
                variant="contained"
                onClick={fetchUserProfile}
                disabled={profileLoading}
                startIcon={<PersonOutlined />}
                sx={{
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 6px 20px rgba(34,197,94,0.3)",
                  "&:hover": {
                    boxShadow: "0 8px 25px rgba(34,197,94,0.4)",
                  },
                }}
              >
                {profileLoading ? "Loading..." : "Get User Profile"}
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Response Data Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 4 }}>
          {/* Admin Data */}
          {adminData && (
            <Card
              sx={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 3,
                animation: "fadeIn 0.4s ease",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "translateY(10px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <InfoOutlined sx={{ color: "#f87171" }} />
                  <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }}>
                    Admin Response
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 2 }} />
                {Object.entries(adminData).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: 2,
                      py: 1,
                      mb: 0.5,
                      borderRadius: 1.5,
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 600, minWidth: 80 }}
                    >
                      {key}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fca5a5", fontWeight: 500 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Profile Data */}
          {profileData && (
            <Card
              sx={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 3,
                animation: "fadeIn 0.4s ease",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "translateY(10px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <VerifiedUserOutlined sx={{ color: "#4ade80" }} />
                  <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }}>
                    Profile Response
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 2 }} />
                {Object.entries(profileData).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: 2,
                      py: 1,
                      mb: 0.5,
                      borderRadius: 1.5,
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 600, minWidth: 80 }}
                    >
                      {key}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#86efac", fontWeight: 500 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Access Level Info */}
        <Card
          sx={{
            background: "rgba(251,191,36,0.05)",
            border: "1px solid rgba(251,191,36,0.15)",
            borderRadius: 3,
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ color: "#fbbf24", fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <VerifiedUserOutlined fontSize="small" /> Admin Access Privileges
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Chip
                label="✅ /api/user/profile"
                size="small"
                sx={{
                  background: "rgba(34,197,94,0.1)",
                  color: "#4ade80",
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              />
              <Chip
                label="✅ /api/admin/dashboard"
                size="small"
                sx={{
                  background: "rgba(34,197,94,0.1)",
                  color: "#4ade80",
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              />
              <Chip
                label="✅ /api/public/**"
                size="small"
                sx={{
                  background: "rgba(34,197,94,0.1)",
                  color: "#4ade80",
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Session Info */}
        <Card
          sx={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 3,
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, mb: 1.5 }}>
              📦 Session Storage
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Chip
                label={`user: ${sessionStorage.getItem("user")}`}
                size="small"
                sx={{
                  background: "rgba(99,102,241,0.1)",
                  color: "#a78bfa",
                  fontFamily: "monospace",
                }}
              />
              <Chip
                label={`role: ${sessionStorage.getItem("role")}`}
                size="small"
                sx={{
                  background: "rgba(251,191,36,0.1)",
                  color: "#fbbf24",
                  fontFamily: "monospace",
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;
