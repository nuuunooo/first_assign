import { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Stack, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
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
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please fill in your details to register
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
            onClick={handleRegister}
            sx={{ 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Create Account
          </Button>
          
          <Button
            variant="text"
            color="secondary"
            fullWidth
            onClick={() => navigate("/login")}
            sx={{ mt: 1 }}
          >
            Already have an account? Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Register;