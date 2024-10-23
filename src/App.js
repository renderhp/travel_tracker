import './App.css';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AirTrafficControl from './components/AirTrafficControl';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfileStats from './components/ProfileStats';

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Enables the dark theme
  },
});


function App() {
  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex">
          {/* Sidebar Component */}
          <Sidebar />

          {/* Main content */}
          <Box flexGrow={1}>
            <Routes>
              <Route path="/travel_tracker" element={<AirTrafficControl />} />
              <Route path="/profile_stats" element={<ProfileStats />} />
              {/* <Route path="/other-page" element={<OtherPage />} /> */}
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
