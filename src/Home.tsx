import {Box, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
function HomePage() {
    const navigate = useNavigate();
    return (
        <>
            <Box sx={{width: '100%'}}>
                <Typography variant="h3" gutterBottom>
                   Homework 1
                </Typography>
            </Box>
            <Button variant="contained" onClick={() => {navigate('/sign-up')}} >
                Sign Up
            </Button>
        </>
    )
}
export default HomePage
