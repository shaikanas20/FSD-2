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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Avatar,
  Divider,
} from "@mui/material";
import {
  PersonOutlined,
  LogoutOutlined,
  SecurityOutlined,
  BlockOutlined,
  InfoOutlined,
  DashboardOutlined,
} from "@mui/icons-material";

function UserDashboard() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const user = sessionStorage.getItem("user");
  const role = sessionStorage.getItem("role");
  const password = sessionStorage.getItem("password");

  useEffect(() => {
    if (!role || !user) {
      navigate("/");
    }
  }, [role, user, navigate]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/user/profile", {
        auth: { username: user, password: password },
      });
      setProfileData(res.data);
      setSnackbar({ open: true, message: "Profile data fetched successfully!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to fetch profile data", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const tryAdminAccess = async () => {
    setAdminLoading(true);
    try {
      await axios.get("http://localhost:8080/api/admin/dashboard", {
        auth: { username: user, password: password },
      });
    } catch (err) {
      if (err.response && (err.response.status === 403 || err.response.status === 401)) {
        setAccessDenied(true);
      }
      setSnackbar({ open: true, message: "Access Denied! You don't have ADMIN privileges.", severity: "error" });
    } finally {
      setAdminLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  if (!role) return null;

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
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            icon={<PersonOutlined sx={{ color: "#a78bfa !important" }} />}
            label={`${user} · ${role?.replace("ROLE_", "")}`}
            sx={{
              background: "rgba(99,102,241,0.15)",
              color: "#a78bfa",
              border: "1px solid rgba(99,102,241,0.25)",
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
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
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
                User Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mt: 0.5 }}>
                Welcome back, <strong style={{ color: "#a78bfa" }}>{user}</strong> — you have{" "}
                <Chip
                  label="USER"
                  size="small"
                  sx={{
                    background: "rgba(34,197,94,0.15)",
                    color: "#4ade80",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    height: 22,
                  }}
                />{" "}
                level access
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 4 }}>
          {/* Profile Card */}
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
                  My Profile
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 3 }}>
                Fetch your profile data from <code style={{ color: "#a78bfa" }}>/api/user/profile</code>
              </Typography>
              <Button
                variant="contained"
                onClick={fetchProfile}
                disabled={loading}
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
                {loading ? "Loading..." : "Get Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* Admin Access Card */}
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
                <BlockOutlined sx={{ color: "#f87171" }} />
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                  Admin Access
                </Typography>
                <Chip
                  label="RESTRICTED"
                  size="small"
                  sx={{
                    background: "rgba(239,68,68,0.15)",
                    color: "#f87171",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    height: 20,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 3 }}>
                Try accessing <code style={{ color: "#f87171" }}>/api/admin/dashboard</code> — expect 403
              </Typography>
              <Button
                variant="outlined"
                onClick={tryAdminAccess}
                disabled={adminLoading}
                startIcon={<BlockOutlined />}
                sx={{
                  borderColor: "rgba(239,68,68,0.5)",
                  color: "#f87171",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "#f87171",
                    background: "rgba(239,68,68,0.08)",
                  },
                }}
              >
                {adminLoading ? "Trying..." : "Try Admin Endpoint"}
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Profile Data Display */}
        {profileData && (
          <Card
            sx={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 3,
              mb: 4,
              animation: "fadeIn 0.4s ease",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(10px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <InfoOutlined sx={{ color: "#4ade80" }} />
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                  Profile Response
                </Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 2.5 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {Object.entries(profileData).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: 2,
                      py: 1.2,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 600, minWidth: 100 }}
                    >
                      {key}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#a78bfa", fontWeight: 500 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Session Info */}
        <Card
          sx={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 3,
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
                  background: "rgba(34,197,94,0.1)",
                  color: "#4ade80",
                  fontFamily: "monospace",
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Access Denied Dialog */}
      <Dialog
        open={accessDenied}
        onClose={() => setAccessDenied(false)}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: "#f87171", fontWeight: 700, display: "flex", alignItems: "center", gap: 1.5 }}>
          <BlockOutlined /> Access Denied
        </DialogTitle>
        <DialogContent>
          <Alert
            severity="error"
            sx={{
              background: "rgba(239,68,68,0.1)",
              color: "#fca5a5",
              border: "1px solid rgba(239,68,68,0.2)",
              "& .MuiAlert-icon": { color: "#f87171" },
            }}
          >
            <strong>403 Forbidden</strong> — You do not have ADMIN privileges to access this resource.
            Your role <strong>{role}</strong> is not authorized.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setAccessDenied(false)}
            sx={{ color: "#a78bfa", textTransform: "none", fontWeight: 600 }}
          >
            Understood
          </Button>
        </DialogActions>
      </Dialog>

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

export default UserDashboard;
