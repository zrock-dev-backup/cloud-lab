import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { Box } from '@mui/material';

export default function Layout() {
    return (
        <Box>
            <Header />
            <main>
                <Outlet />
            </main>
        </Box>
    );
}
