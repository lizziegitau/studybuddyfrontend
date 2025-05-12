import '../App.css';
import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
  
  const HeroSection = styled(Box)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    height: '100%',
    background: 'white',
  });

function LandingPage () {

    const navigate = useNavigate();

    return (
        <div>
            <Box sx={{display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: '#9381FF', overflow: 'hidden' }}>
                <Box className="imageContainer">
                    <img alt='StudyBuddy Logo' src="/images/studybuddylargelogo.png" className="logo" />
                    <img alt='Landing Page Illustration' src="/images/landing.png" className="illustration" />
                    <h1>Welcome to StudyBuddy👋!</h1>
                </Box>
                <HeroSection>
                    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Stay Organized. Study Smarter.
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4 }}>
                            Manage tasks, plan your week, and boost focus with StudyBuddy.
                            </Typography>
                                <Button sx={{ backgroundColor: '#9381FF', '&:hover': { backgroundColor: '#7A6AD9' },  px: 4, color: 'white' }} onClick={() => navigate('/signup')} >
                                    Get Started
                                </Button>
                        </Box>
                    </Container>
                </HeroSection>

            </Box>
        </div>
    )
}

export default LandingPage;
