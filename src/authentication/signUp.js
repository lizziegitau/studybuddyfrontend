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
import Alert from "@mui/material/Alert";
import { useSignUp } from "@clerk/clerk-react";

function SignUp () {

    const { signUp, isLoaded } = useSignUp();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleSignUp = async (event) => {
        event.preventDefault(); 
    
        if (!isLoaded) {
            setError("Clerk is still loading. Please wait.");
            return;
        }
        
        if (!name.trim()) return setError("Name is required.");
        if (!email.includes("@")) return setError("Invalid email format.");
        if (password.length < 6) return setError("Password must be at least 6 characters.");
    
        try {
            await signUp.create({
                username: name,
                email_address: email,
                password,
              });

          await signUp.prepareVerification({ strategy: "email_code" });

        window.location.href = "/verify-signup";
    
        } catch (err) {
          setError(err.errors[0]?.message || "Sign-in failed. Please try again.");
        }
      };

      const handleGoogleSignUp = async () => {
        if (!isLoaded) {
            setError("Clerk is still loading. Please wait.");
            return;
        }
        
        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/dashboard"
            });
        } catch (err) {
            console.error("Google sign up error:", err);
            setError("Failed to initiate Google sign up. Please try again.");
        }
    };

    return (
        <div className="signup">
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
                    {error && <Alert severity="error">{error}</Alert>}
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