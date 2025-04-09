import { useEffect } from 'react';
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";
import LoadingPage from "../components/loadingPage";

const SSOCallback = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      if (user.username) {
        window.location.href = "/dashboard";
      }
    }
  }, [user]);
  
  return (
    <div className="sso-callback-container">
      <LoadingPage/>
      <AuthenticateWithRedirectCallback 
        signUpFallbackRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
        onError={(error) => {
          console.error("Authentication Error:", error);
        }}
      />
    </div>
  );
};

export default SSOCallback;