import { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Stack, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", { username, password });
      const token = `Bearer ${response.data.token}`;
      console.log("Token received from server:", token); // Log the token for debugging
      localStorage.setItem("token", token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userId", response.data.userId || response.data.id);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        px: 2,
        boxSizing: 'border-box'
      }}
    >
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please sign in to your account
          </Typography>
        </Box>

        <Stack spacing={3}>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button 
            variant="contained"
            color="primary"
            size="large"
            fullWidth 
            onClick={handleLogin}
            sx={{ 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Sign In
          </Button>
          
          <Button
            variant="text"
            color="secondary"
            fullWidth
            onClick={() => navigate("/register")}
            sx={{ mt: 1 }}
          >
            Don't have an account? Register
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
