import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed by default

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <IconButton onClick={toggleSidebar} sx={{ position: 'absolute', zIndex: 1201, top: 16, right: 16 }}>
                <MenuIcon sx={{ color: 'white' }} />
            </IconButton>
            <Drawer
                variant="persistent"
                anchor="right"
                open={sidebarOpen}
                sx={{
                    width: 2,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        backgroundColor: '#333', // Adjust color to match dark theme
                        paddingTop: 8,
                    },
                }}
            >
                <Divider />
                <List>
                    <ListItem button component={Link} to="/">
                        <ListItemIcon sx={{ minWidth: 40 }}><ConnectingAirportsIcon sx={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary="Air Traffic Control" sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button component={Link} to="/profile_stats">
                        <ListItemIcon sx={{ minWidth: 40 }}><BarChartIcon sx={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary="Profile Stats" sx={{ color: 'white' }} />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}

export default Sidebar;
