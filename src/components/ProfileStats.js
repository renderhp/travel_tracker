import { Box, Stack, TextField, Button, Tooltip, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import axios from 'axios';
import * as XLSX from 'xlsx';


export default function ProfileStats() {
    const [apiToken, setApiToken] = useState('')
    const [profileList, setProfileList] = useState('')
    const [currentIteration, setCurrentIteration] = useState(0);
    const [totalIterations, setTotalIterations] = useState(0);
    const [loading, setLoading] = useState(false);

    const downloadExcel = (data) => {
        const formattedData = data.map(item => {
            return {
                "Player ID": item["Player ID"], // Keep as plain text
                "Name": item["Name"], // Keep as plain text
                "Profile Link": {
                    l: {
                        Target: item["Profile Link"], // URL for the link
                        Tooltip: 'Click to view profile' // Optional tooltip
                    },
                    v: `${item["Profile Link"]}` // Display value
                },
                "Level": item["Level"], // Keep as plain text
                "Attacks Won": item["Attacks Won"], // Keep as plain text
                "Xanax Taken": item["Xanax Taken"], // Keep as plain text
                "Elo": item["Elo"], // Keep as plain text
                "Ranked War Hits": item["Ranked War Hits"], // Keep as plain text
                "Energy Drinks Used": item["Energy Drinks Used"], // Keep as plain text
                "Stat Enhancers Used": item["Stat Enhancers Used"], // Keep as plain text
                "Time played (days)": item["Time played (days)"], // Keep as plain text
                "Refills": item["Refills"], // Keep as plain text
                "Merits Bought": item["Merits Bought"], // Keep as plain text
                "Days Been Donator": item["Days Been Donator"], // Keep as plain text
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleLoadProfiles = async () => {
        if (apiToken.length === 0) {
            alert('Please input a public API Key');
            return;
        }

        setLoading(true);
        const lines = profileList.split("\n")
        const extractedIds = lines.map(line => {
            // Use a regular expression to find the ID in the URL or return the number directly
            const match = line.match(/XID=(\d+)/);
            return match ? match[1] : line; // If a match is found, return the ID; otherwise, return the line itself
        });
        setTotalIterations(extractedIds.length)
        setCurrentIteration(0)

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const processIdsWithDelay = async (extractedIds, apiToken) => {
            const res = []
            for (const [index, id] of extractedIds.entries()) {
                console.log(`Index: ${index}, ID: ${id}`);
                const api_link = `https://api.torn.com/user/${id}?selections=basic,personalstats&key=${apiToken}`;
                try {
                    const response = await axios.get(api_link);
                    const basic = response.data
                    console.log(response)
                    const stats = response.data.personalstats
                    console.log(stats)
                    res.push(
                        {
                            "Player ID": basic.player_id,
                            "Name": basic.name,
                            "Profile Link": `https://www.torn.com/profiles.php?XID=${basic.player_id}`,
                            "Level": basic.level,
                            "Attacks Won": stats.attackswon,
                            "Xanax Taken": stats.xantaken,
                            "Elo": stats.elo,
                            "Ranked War Hits": stats.rankedwarhits,
                            "Energy Drinks Used": stats.energydrinkused,
                            "Stat Enhancers Used": stats.statenhancersused,
                            "Time played (days)": (stats.useractivity / 60 / 60 / 24).toFixed(2),
                            "Refills": stats.refills,
                            "Merits Bought": stats.meritsbought,
                            "Days Been Donator": stats.daysbeendonator,
                        }
                    )
                    // Update current iteration (if needed)
                    setCurrentIteration(index + 1);
                } catch (error) {
                    console.error(`Error fetching data for ID ${id}:`, error);
                }
                await sleep(1000);
            }
            console.log(res)
            setLoading(false)
            downloadExcel(res);
        };
        processIdsWithDelay(extractedIds, apiToken);
    };
    const loadButton = <Button variant="contained" onClick={handleLoadProfiles}>Load Profiles</Button>

    return (
        <Box margin={2}>
            <Stack direction="row" alignItems="center">
                <h2 style={{ margin: 0 }}>Profile Stats (v0.1)</h2>
                <Tooltip title="TODO LOL. Trust me, bro, it works :)" arrow>
                    <HelpOutlineIcon style={{ marginLeft: 8, cursor: 'pointer' }} />
                </Tooltip>
            </Stack>
            <Stack spacing={2}>
                <TextField
                    id="standard-basic"
                    label="API Token"
                    variant="standard"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                />
                <TextField
                    id="standard-basic"
                    label="Profile Links"
                    variant="standard"
                    value={profileList}
                    multiline
                    onChange={(e) => setProfileList(e.target.value)}
                />
                <Stack direction="row" spacing={2}>
                    {!loading && loadButton}
                    {loading && (
                        <Box display="flex" alignItems="center" marginTop={2}>
                            <CircularProgress size={24} style={{ marginRight: 16 }} />
                            <Typography>
                                {`Loading: ${currentIteration} out of ${totalIterations}`}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
}