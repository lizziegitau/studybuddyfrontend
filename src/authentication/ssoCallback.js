import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

const SSOCallback = () => {
  
  return (
    <div className="sso-callback-container">
      <p>Processing your authentication...</p>
      <AuthenticateWithRedirectCallback 
        signUpFallbackRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
      />
    </div>
  );
};

export default SSOCallback;