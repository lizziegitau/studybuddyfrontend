import { useState ,useEffect } from 'react';
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";
import LoadingPage from "../components/loadingPage";
import SimpleSnackbar from '../components/snackbar';

const SSOCallback = () => {
  const { user } = useUser();
  const [snackbar, setSnackbar] = useState({
          open: false,
          message: '',
          severity: 'info',
      });

  useEffect(() => {
    if (user) {
      if (user.username) {
        window.location.href = "/dashboard";
      }
    }
  }, [user]);

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
  
  return (
    <div className="sso-callback-container">
      <SimpleSnackbar
        open={snackbar.open}
        onClose={hideSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
        duration={4000}
      />
      <LoadingPage/>
      <AuthenticateWithRedirectCallback 
        signUpFallbackRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
        onError={(error) => {
          console.error("Authentication Error:", error);
          showSnackbar("Authentication Error", "error");
        }}
      />
    </div>
  );
};

export default SSOCallback;