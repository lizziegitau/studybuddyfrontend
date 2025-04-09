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
import { useSignIn } from "@clerk/clerk-react";

function LogIn () {

    const { signIn, isLoaded } = useSignIn();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    if (!isLoaded) return null;

    const handleSignIn = async (event) => {
        event.preventDefault();

        if (!email) {
            setError("Please enter your email.");
            return;
          }
          
          if (!password) {
            setError("Please enter your password.");
            return;
          }
    
        try {
            const signInAttempt = await signIn.create({
                identifier: email,
            });
    
            const result = await signInAttempt.attemptFirstFactor({
                strategy: "password",
                password: password,
            });
    
            if (result.status === "complete") {
                window.location.href = "/dashboard";
            } else {
                setError("Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError(err.errors?.[0]?.long_message || "Sign-in failed. Please try again.");
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
                <h1>Welcome Back!</h1>
                <div className="socialContainer">
                    <Button variant="contained" sx={{ backgroundColor: "#9381ff", color: "white", borderRadius: "20px", width: "100%"}} onClick={() => signIn.authenticateWithRedirect({ strategy: "oauth_google", redirectUrl: "/dashboard", })}>
                        Log In with Google
                    </Button>
                </div>
                <h3>or sign in with your email address</h3>
                <div className="inputContainer">
                {error && <Alert severity="error">{error}</Alert>}
                    <Box 
                        component="form" 
                        sx={{ '& .MuiTextField-root': { display: "flex", flexDirection: "column", gap: 2, width: "100%", alignItems: "center", maxWidth: "400px" } }} 
                        onSubmit={handleSignIn}
                    >
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: 2, marginTop: "10px" }}
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
                            Log In
                        </Button>
                        <span>Don't have an account? <Link href="/signup" underline="hover" >Signup</Link></span>
                    </Box>
                </div>
            </div>
            
        </div>
    )
}

export default LogIn;