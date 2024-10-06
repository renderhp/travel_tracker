import './App.css';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TravelTable from './components/TravelTable'
import axios from 'axios';


const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Enables the dark theme
  },
});


function App() {
  const [factionId, setFactionId] = useState('')
  const [apiToken, setApiToken] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [factionData, setFactionData] = useState({})
  const [isFirstRefresh, setIsFirstRefresh] = useState(true)
  const [lastUpdateTime, setLastUpdateTime] = useState(null); // New state for last update time

  useEffect(() => {
    const filterPlayersByCountry = (players) => {
      const countryMap = {
        "Mexico": ["Mexico", "Mexican"],
        "Cayman Islands": ["Cayman"],
        "Canada": ["Canad"],
        "Hawaii": ["Hawai"],
        "United Kingdom": ["United Kingdom", "British"],
        "Argentina": ["Argentin"],
        "Switzerland": ["Switzerland", "Swiss"],
        "Japan": ["Japan"],
        "China": ["Chin"],
        "UAE": ["UAE"],
        "South Africa": ["Africa"],
        "Torn": ["Okay", "In hospital for"],
      }
      const countryOrder = [
        "Mexico",
        "Cayman Islands",
        "Canada",
        "Hawaii",
        "United Kingdom",
        "Argentina",
        "Switzerland",
        "Japan",
        "China",
        "UAE",
        "South Africa",
        "Torn",
      ]
      const filteredPlayers = {};

      players.forEach((player) => {
        for (const [country, substrings] of Object.entries(countryMap)) {
          if (substrings.some(substring => player.status.toLowerCase().includes(substring.toLowerCase()))) {
            if (!filteredPlayers[country]) {
              filteredPlayers[country] = [];
            }
            filteredPlayers[country].push(player);
            break; // Stop checking once matched
          }
        }
      });

      for (const country in filteredPlayers) {
        filteredPlayers[country].sort((a, b) => b.status.localeCompare(a.status));
      }

      // Create a sorted object based on the custom order
      const sortedFilteredPlayers = {};
      countryOrder.forEach(country => {
        if (filteredPlayers[country]) {
          sortedFilteredPlayers[country] = filteredPlayers[country];
        } else {
          sortedFilteredPlayers[country] = []
        }
      });

      console.log(sortedFilteredPlayers)
      return sortedFilteredPlayers;
    };

    let interval;
    if (isTracking) {
      interval = setInterval(async () => {
        const api_link = `https://api.torn.com/faction/${factionId}?selections=&key=${apiToken}`
        const response = await axios.get(api_link)
        const result = Object.entries(response.data.members).map(([key, value]) => {
          return {
            id: key,
            name: value.name,
            status: value.status.description,
            color: value.status.color,
          };
        })

        // for each country get a list of people in there by filtering status with substrings provided in the countryMap
        const filteredResults = filterPlayersByCountry(result)

        setIsFirstRefresh(false);
        setFactionData(filteredResults);
        setLastUpdateTime(new Date().toLocaleTimeString());
      }, isFirstRefresh ? 3000 : 10000);
    }
    // Cleanup interval when component unmounts or when tracking stops
    return () => clearInterval(interval);
  }, [isTracking, apiToken, factionId, isFirstRefresh]);

  const handleStartClick = () => {
    if (factionId.length === 0 || apiToken.length === 0) {
      alert('You need to input both the token and the faction ID, friendo');
      return;
    }
    if (!isTracking) {
      setIsFirstRefresh(true)
      setIsTracking(true);
    } else {
      setIsTracking(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box margin={2}>
        <h2>EPIC Mafia Travel Tracker (v0.1)</h2>
        <Stack spacing={5}>
          <Stack direction="row" spacing={2}>
            <TextField
              id="standard-basic"
              label="Faction ID"
              variant="standard"
              value={factionId}
              onChange={(e) => setFactionId(e.target.value)}
            />
            <TextField
              id="standard-basic"
              label="API Key"
              variant="standard"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
            />
            <Button variant="contained" onClick={handleStartClick}>{isTracking ? "Stop" : "Start"}</Button>
            {lastUpdateTime && (
              <span style={{ marginLeft: '16px', alignSelf: 'center' }}>
                Last Update: {lastUpdateTime}
              </span>
            )}
          </Stack>
          <Stack spacing={2}>
            {Object.keys(factionData).map((countryName) => {
              const players = factionData[countryName]
              console.log(players)
              return <TravelTable key={countryName} countryName={countryName} playersInCountry={players} />
            }
            )}
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
