import '../App.css';
import { CircularProgress } from "@mui/material";

function LoadingPage () {
    return(
        <div className="loading-container">
            <CircularProgress sx={{ color: '#B8B8FF'}} size={50} />
            <p>Loading your page...</p>
        </div>
    )
}

export default LoadingPage