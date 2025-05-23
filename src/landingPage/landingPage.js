import '../App.css';
import { Box, Button, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div>
            {isMobile ? (
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100vw',
                    minHeight: '100vh',
                    backgroundColor: '#9381FF',
                }}
                >
                <Box className="landingContent">
                    <img
                    alt="StudyBuddy Logo"
                    src="/images/studybuddylargelogo.png"
                    className="logoLanding"
                    />
                    <img
                    alt="Landing Page Illustration"
                    src="/images/landing.png"
                    className="illustrationLanding"
                    />
                    <Typography variant="h4" className="landingTitle">
                    Welcome to StudyBuddy 👋
                    </Typography>
                    <Typography variant="h6" className="landingSubtitle">
                    Stay Organized. Study Smarter.
                    </Typography>
                    <Typography variant="body1" className="landingBody">
                    Manage tasks, plan your week, and boost focus with StudyBuddy.
                    </Typography>
                    <Button
                    sx={{
                        mt: 3,
                        px: 4,
                        backgroundColor: '#fff',
                        color: '#9381FF',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                    }}
                    onClick={() => navigate('/signup')}
                    >
                    Get Started
                    </Button>
                </Box>
                </Box>
            ): ( 
            <Box sx={{display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: '#9381FF', overflow: 'hidden' }}>
                <Box className="imageContainerLanding">
                    <img alt='StudyBuddy Logo' src="/images/studybuddylargelogo.png" className="logoLanding" />
                    <img alt='Landing Page Illustration' src="/images/landing.png" className="illustrationLanding" />
                    <h1>Welcome to StudyBuddy👋!</h1>
                </Box>
                <HeroSection>
                <Container
                    maxWidth="lg"
                    sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: { xs: 4, md: 0 },
                    mt: { xs: 4, md: 0 }
                    }}
                    >
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
            )}
        </div>
    )
}

export default LandingPage;
