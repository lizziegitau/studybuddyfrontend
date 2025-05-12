import '../App.css'
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useSignUp } from "@clerk/clerk-react";
import SimpleSnackbar from '../components/snackbar';

function SignUp () {

    const { signUp, isLoaded } = useSignUp();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const showSnackbar = (message, severity = 'error') => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const hideSnackbar = () => {
        setSnackbar(prev => ({
            ...prev,
            open: false,
        }));
    };

    const handleSignUp = async (event) => {
        event.preventDefault(); 
    
        if (!isLoaded) {
            showSnackbar("Clerk is still loading. Please wait.", "error");
            return;
        }
        
        if (!name.trim()) {
            showSnackbar("Please enter your name.", "error");
            return false;
        }   
        if (!email.includes("@")) {
            showSnackbar("Please enter your email.", "error");
            return false;
        }   
        if (password.length < 6) {
            showSnackbar("Please enter your password.", "error");
            return false;
        }   
    
        try {
            await signUp.create({
                username: name,
                email_address: email,
                password,
              });

          await signUp.prepareVerification({ strategy: "email_code" });

          showSnackbar("Verifying your email...", "info");
          setTimeout(() => {
              window.location.href = "/verify-signup";
          }, 1500);
    
        } catch (err) {
            const errorMessage = err.errors[0]?.message || "Sign-in failed. Please try again."
          showSnackbar(errorMessage, "error");
        }
      };

      const handleGoogleSignUp = async () => {
        if (!isLoaded) {
            showSnackbar("Clerk is still loading. Please wait.", "error");
            return;
        }
        
        try {
            showSnackbar("Redirecting to Google login...", "info");
            setTimeout(async () => {
                await signUp.authenticateWithRedirect({
                    strategy: "oauth_google",
                    redirectUrl: "/sso-callback",
                });
            }, 1000);
        } catch (err) {
            console.error("Google sign up error:", err);
            showSnackbar("Failed to initiate Google sign up. Please try again.", "error");
        }
    };

    return (
        <div className="signup">
            <SimpleSnackbar
                open={snackbar.open}
                onClose={hideSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
            />
            <div className="imageContainer">
                <img alt='StudyBuddy Logo' src="/images/studybuddylargelogo.png" className="logo" />
                    <img alt='studying pic' src="/images/studying.png" className="illustration" />
                    <h1>Welcome to StudyBuddy👋!</h1>
            </div>
            <div className="formContainer">
                <h1>Create Account</h1>
                <div className="socialContainer">
                    <Button variant="contained" sx={{ backgroundColor: "#9381ff", color: "white", borderRadius: "20px", width: "100%"}} onClick={handleGoogleSignUp}>
                        Sign Up with Google
                    </Button>
                </div>
                <h3>or sign up with your email address</h3>
                <div className="inputContainer">
                    <Box 
                        component="form" 
                        sx={{ '& .MuiTextField-root': { display: "flex", flexDirection: "column", gap: 2, width: "100%", alignItems: "center", maxWidth: "400px" } }} 
                        onSubmit={handleSignUp}
                    >
                        <TextField
                            label="Username"
                            type="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: 2, marginTop: "10px" }}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        />
                        <FormControl sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", alignItems: "center" }} variant="outlined">
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Button type="submit" variant="contained" sx={{ backgroundColor: "#9381ff", color: "white", width: "100%", marginTop: 2, marginBottom: 1, borderRadius: "20px", "&:hover": {backgroundColor: "#7a6be6", transform: "scale(1.02)", transition: "0.2s ease-in-out",}}}>
                            Sign Up
                        </Button>
                        <span>Already have an account? <Link href="/login" underline="hover" >Login</Link> </span>
                    </Box>
                </div>
            </div>
            
        </div>
    )
}

export default SignUp