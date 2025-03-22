import { useEffect } from "react";
import { useUser, useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function VerifyGoogle() {
    const { isSignedIn, user } = useUser();
    const { signUp } = useSignUp();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSignedIn && user) {
            // Check if email is verified
            if (!user.primaryEmailAddress.verified) {
                signUp.prepareVerification({ strategy: "email_code" })
                    .then(() => navigate("/verify-signup")) // Redirect to verification page
                    .catch((err) => console.error("Error sending verification email:", err));
            } else {
                navigate("/dashboard"); // If verified, go to dashboard
            }
        }
    }, [isSignedIn, user, signUp, navigate]);

    return <div>Verifying Google Sign-Up...</div>;
}

export default VerifyGoogle;
