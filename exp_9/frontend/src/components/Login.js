import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      if (res.status === 200) {
        const { username: user, role } = res.data;
        sessionStorage.setItem("user", user);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("password", password);

        if (role === "ROLE_ADMIN") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background orbs */}
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
          top: -100,
          left: -100,
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(30px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)",
          bottom: -80,
          right: -80,
          animation: "float2 8s ease-in-out infinite",
          "@keyframes float2": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-25px)" },
          },
        }}
      />

      {/* Login Card */}
      <Box
        component="form"
        onSubmit={login}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 4,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 45px rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 1,
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        }}
      >
        {/* Lock Icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 25px rgba(99,102,241,0.4)",
            }}
          >
            <LockOutlined sx={{ fontSize: 32, color: "#fff" }} />
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: "#fff",
            fontWeight: 700,
            mb: 1,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "rgba(255,255,255,0.5)",
            mb: 4,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Sign in to access your RBAC Dashboard
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              background: "rgba(239,68,68,0.15)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.3)",
              "& .MuiAlert-icon": { color: "#f87171" },
            }}
          >
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlined sx={{ color: "rgba(255,255,255,0.4)" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.1)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(99,102,241,0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6366f1",
              },
            },
            "& input::placeholder": {
              color: "rgba(255,255,255,0.4)",
            },
          }}
        />

        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined sx={{ color: "rgba(255,255,255,0.4)", fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.1)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(99,102,241,0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6366f1",
              },
            },
            "& input::placeholder": {
              color: "rgba(255,255,255,0.4)",
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            borderRadius: 2,
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 8px 25px rgba(99,102,241,0.35)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #5558e6 0%, #9645e6 100%)",
              boxShadow: "0 12px 35px rgba(99,102,241,0.5)",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.3)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Sign In"
          )}
        </Button>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
            }}
          >
            Demo Credentials: user1 / user123 &nbsp;|&nbsp; admin1 / admin123
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
