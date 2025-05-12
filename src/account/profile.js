import '../App.css';
import { UserProfile } from '@clerk/clerk-react'
import { Box } from '@mui/material'

function SettingsPage () {

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#FFEEDD", py: 4 }}>
      <UserProfile/>
    </Box>
  )
}

export default SettingsPage
