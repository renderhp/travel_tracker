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
        const worksheet = XLSX.utils.json_to_sheet(data);
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
                            "player_id": basic.player_id,
                            "name": basic.name,
                            "level": basic.level,
                            "active_streak": stats.activestreak,
                            "xanax_taken": stats.xantaken,
                            "attacks_won": stats.attackswon,
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
                <h2 style={{ margin: 0 }}>Profile Stats</h2>
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