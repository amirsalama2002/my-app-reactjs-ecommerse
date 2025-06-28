import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Register.css'; // استيراد ملف CSS

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Registration successful! Redirecting...");
        setTimeout(() => navigate("/products"), 1000);
      } else {
        const errors = Object.values(data.errors || {}).flat().join(" | ");
        setMessage(errors || "Registration failed. Please check your inputs.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("An error occurred during registration. Please try again.");
    }
  };

  return (
    <Container maxWidth={false} className="register-container">
      <Box className="register-card">
        <Typography variant="h5" className="register-title">
          Register
        </Typography>
        <Typography variant="body2" color="textSecondary" className="register-subtitle">
          Create your account
        </Typography>

        {message && <Alert severity="info" className="register-alert">{message}</Alert>}

        <Box component="form" onSubmit={handleRegister} className="register-form">
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            margin="normal"
            onChange={handleChange}
            className="register-input"
            placeholder="Enter your full name"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            onChange={handleChange}
            className="register-input"
            placeholder="Enter your email"
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            onChange={handleChange}
            className="register-input"
            placeholder="Choose a password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            name="password_confirmation"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            onChange={handleChange}
            className="register-input register-confirm-password-input"
            placeholder="Confirm your password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            className="register-button"
          >
            Register
          </Button>
        </Box>
        <Typography variant="body2" className="login-link-text">
            Already have an account? <span onClick={() => navigate('/login')} className="login-link">Login here</span>
        </Typography>
      </Box>
    </Container>
  );
}