import TravelTable from './TravelTable'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';

export default function AirTrafficControl() {
    const [factionId, setFactionId] = useState('')
    const [apiToken, setApiToken] = useState('')
    const [isTracking, setIsTracking] = useState(false)
    const [factionData, setFactionData] = useState({})
    const [isFirstRefresh, setIsFirstRefresh] = useState(true)
    const [lastUpdateTime, setLastUpdateTime] = useState(null); // New state for last update time
    const [lastPlayerStatus, setLastPlayerStatus] = useState({});
    const [lastRegisteredUpdate, setLastRegisteredUpdate] = useState({});

    const kStatusInCountry = 1
    const kStatusTravelling = 2
    const kStatusReturning = 3
    const kStatusInHospital = 4
    const kStatusUnknown = -1

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
                "UAE": ["UAE", "Emirat"],
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

            return sortedFilteredPlayers;
        };

        const getPlayerStatusDict = (api_result) => {
            const res = {}
            api_result.forEach((player, index) => {
                // console.log(player)
                res[player.id] = getGenericStatus(player)
            })
            return res
        }

        const getGenericStatus = (status) => {
            if (status.description.includes("Okay")) {
                return kStatusInCountry
            }
            if (status.description.includes("In ") && status.color === "red") {
                return kStatusInHospital
            }
            if (status.description.includes("In ") && status.color === "blue") {
                return kStatusInCountry
            }
            if (status.description.includes("Traveling")) {
                return kStatusTravelling
            }
            if (status.description.includes("Returning")) {
                return kStatusReturning
            }
            return kStatusUnknown
        }

        let interval;
        if (isTracking) {
            interval = setInterval(async () => {
                const api_link = `https://api.torn.com/faction/${factionId}?selections=&key=${apiToken}`
                const response = await axios.get(api_link)
                const result = Object.entries(response.data.members).map(([key, value]) => {
                    // console.log(lastPlayerStatus[key])
                    // console.log(getGenericStatus(value.status))
                    // console.log("====")
                    return {
                        id: key,
                        name: value.name,
                        status: value.status.description,
                        description: value.status.description,
                        color: value.status.color,
                        current_generic_status: getGenericStatus(value.status),
                        last_generic_status: lastPlayerStatus[key],
                        last_status_change: getGenericStatus(value.status) === lastPlayerStatus[key]
                            ? lastRegisteredUpdate[key]
                            : Date.now(),
                        last_action: value.last_action.relative,
                        online_status: value.last_action.status,
                        level: value.level

                    };
                })
                const newPlayerStatus = getPlayerStatusDict(result)
                const newLastRegisteredUpdate = {}
                result.forEach((player, index) => {
                    newLastRegisteredUpdate[player.id] = player.last_status_change
                })
                // console.log(result)
                setLastPlayerStatus(newPlayerStatus)
                setLastRegisteredUpdate(newLastRegisteredUpdate)

                // for each country get a list of people in there by filtering status with substrings provided in the countryMap
                const filteredResults = filterPlayersByCountry(result)

                setIsFirstRefresh(false);
                setFactionData(filteredResults);
                setLastUpdateTime(new Date().toLocaleTimeString());
            }, isFirstRefresh ? 3000 : 10000);
        }
        // Cleanup interval when component unmounts or when tracking stops
        return () => clearInterval(interval);
    }, [isTracking, apiToken, factionId, isFirstRefresh, kStatusUnknown, lastPlayerStatus, lastRegisteredUpdate]);

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
        <Box margin={2}>
            <h2>EPIC Mafia Air Traffic Control (v0.2)</h2>
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
                        return <TravelTable key={countryName} countryName={countryName} playersInCountry={players} />
                    }
                    )}
                </Stack>
            </Stack>
        </Box>
    );
}
