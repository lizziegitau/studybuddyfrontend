import { useState, useRef, Fragment } from "react";
import { useSignUp } from "@clerk/clerk-react";
import PropTypes from 'prop-types';
import { Input as BaseInput } from '@mui/base/Input';
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const InputElement = styled('input')(
    () => `
    width: 40px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 0;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #9381FF;
    `
);

function OTP({ separator, length, value, onChange }) {
    const inputRefs = useRef(new Array(length).fill(null));
  
    const focusInput = (targetIndex) => {
      const targetInput = inputRefs.current[targetIndex];
      targetInput.focus();
    };
  
    const selectInput = (targetIndex) => {
      const targetInput = inputRefs.current[targetIndex];
      targetInput.select();
    };
  
    const handleKeyDown = (event, currentIndex) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case ' ':
          event.preventDefault();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (currentIndex > 0) {
            focusInput(currentIndex - 1);
            selectInput(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentIndex < length - 1) {
            focusInput(currentIndex + 1);
            selectInput(currentIndex + 1);
          }
          break;
        case 'Delete':
          event.preventDefault();
          onChange((prevOtp) => {
            const otp =
              prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
            return otp;
          });
  
          break;
        case 'Backspace':
          event.preventDefault();
          if (currentIndex > 0) {
            focusInput(currentIndex - 1);
            selectInput(currentIndex - 1);
          }
  
          onChange((prevOtp) => {
            const otp =
              prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
            return otp;
          });
          break;
  
        default:
          break;
      }
    };
  
    const handleChange = (event, currentIndex) => {
      const currentValue = event.target.value;
      let indexToEnter = 0;
  
      while (indexToEnter <= currentIndex) {
        if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
          indexToEnter += 1;
        } else {
          break;
        }
      }
      onChange((prev) => {
        const otpArray = prev.split('');
        const lastValue = currentValue[currentValue.length - 1];
        otpArray[indexToEnter] = lastValue;
        return otpArray.join('');
      });
      if (currentValue !== '') {
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
        }
      }
    };
  
    const handleClick = (event, currentIndex) => {
      selectInput(currentIndex);
    };
  
    const handlePaste = (event, currentIndex) => {
      event.preventDefault();
      const clipboardData = event.clipboardData;
  
      if (clipboardData.types.includes('text/plain')) {
        let pastedText = clipboardData.getData('text/plain');
        pastedText = pastedText.substring(0, length).trim();
        let indexToEnter = 0;
  
        while (indexToEnter <= currentIndex) {
          if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
            indexToEnter += 1;
          } else {
            break;
          }
        }
  
        const otpArray = value.split('');
  
        for (let i = indexToEnter; i < length; i += 1) {
          const lastValue = pastedText[i - indexToEnter] ?? ' ';
          otpArray[i] = lastValue;
        }
  
        onChange(otpArray.join(''));
      }
    };
  
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {new Array(length).fill(null).map((_, index) => (
          <Fragment key={index}>
            <BaseInput
              slots={{
                input: InputElement,
              }}
              aria-label={`Digit ${index + 1} of OTP`}
              slotProps={{
                input: {
                  ref: (ele) => {
                    inputRefs.current[index] = ele;
                  },
                  onKeyDown: (event) => handleKeyDown(event, index),
                  onChange: (event) => handleChange(event, index),
                  onClick: (event) => handleClick(event, index),
                  onPaste: (event) => handlePaste(event, index),
                  value: value[index] ?? '',
                },
              }}
            />
            {index === length - 1 ? null : separator}
          </Fragment>
        ))}
      </Box>
    );
  }
  
  OTP.propTypes = {
    length: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    separator: PropTypes.node,
    value: PropTypes.string.isRequired,
  };

function SignUpVerification() {
    const { signUp, isLoaded, setActive } = useSignUp();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async (event) => {
        event.preventDefault();

        if (!isLoaded) return;
        if (!otp.trim()) return setError("Please enter the OTP.");

        setLoading(true);
        try {
            const result = await signUp.attemptVerification({ strategy: "email_code", code: otp });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                window.location.href = "/dashboard";
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } catch (err) {
            setError(err.errors[0]?.message || "Verification failed. Please try again.");
        } finally {
          setLoading(false);
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
                <h1>Verify Your Email</h1>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={handleVerify}>
                <OTP separator={<span>-</span>} value={otp} onChange={setOtp} length={6} />
                    <Button type="submit" variant="contained" disabled={loading} sx={{ backgroundColor: "#9381ff", color: "white", width: "100%" }}>
                      {loading ? "Verifying..." : "Verify & Continue"}
                    </Button>
                </Box>
            </div>
        </div>
    );
}

export default SignUpVerification;
