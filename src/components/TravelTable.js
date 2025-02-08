import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack, Collapse, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'; // Import an icon for a better look
import TimeAgo from 'react-timeago';


export default function TravelTable({ countryName, playersInCountry }) {
    // console.log(playersInCountry)
    const [open, setOpen] = React.useState(true); // State to manage the collapse
    const getColor = (color) => {
        if (color === "blue") {
            return "#3BC9DB"
        } else if (color === "red") {
            return "#E54C19"
        } else if (color === "green") {
            return "#99CC00"
        }
        return color
    }

    const getStatusColor = (status) => {
        if (status === "Offline") {
            return "#8e9394"
        } else if (status === "Idle") {
            return "#EEA900"
        } else if (status === "Online") {
            return "#99CC00"
        }
        return status
    }

    const customFormatter = (value, unit, suffix, epochMilliseconds, nextFormatter) => {
        if (unit === 'minute' || unit === 'second') {
            return `${value} ${unit}${value !== 1 ? 's' : ''} ${suffix}`;
        }
        if (unit === 'hour') {
            const minutesAgo = Math.floor((Date.now() - epochMilliseconds) / 60000) % 60;
            return `${value} hr${value !== 1 ? 's' : ''} ${minutesAgo} min${minutesAgo !== 1 ? 's' : ''} ${suffix}`;
        }
        return nextFormatter(value, unit, suffix);
    };

    const table = (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left" sx={{ width: '5%' }}>Action</TableCell>
                        <TableCell align="left" sx={{ width: '15%' }}>Name (Lvl)</TableCell>
                        <TableCell align="center" sx={{ flexGrow: 1 }}>Travel Status</TableCell>
                        <TableCell align="center" sx={{ width: '10%' }}>Online Status</TableCell>
                        <TableCell align="left" sx={{ width: '10%' }}>Last Change</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {playersInCountry.map((row) => (

                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left" sx={{ width: '100px' }}>
                                <Typography
                                    component="a"
                                    href={`https://www.torn.com/loader.php?sid=attack&user2ID=${row.id}`} // Change this to your desired URL
                                    target="_blank"
                                    className="button"
                                    rel="noopener noreferrer"

                                >
                                    Attack
                                </Typography>
                            </TableCell>
                            <TableCell align="left" sx={{ width: '100px' }}>
                                <Typography
                                    component="a"
                                    href={`https://www.torn.com/profiles.php?XID=${row.id}`} // Change this to your desired URL
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: 'primary.main', // Theme color for links
                                        textDecoration: 'none', // Remove underline
                                        '&:hover': {
                                            textDecoration: 'underline', // Underline on hover
                                        },
                                    }}
                                >
                                    {row.name} ({row.level})
                                </Typography>
                                <br />
                                ID: {row.id}
                            </TableCell>
                            <TableCell align="center" sx={{ flexGrow: 1, color: getColor(row.color) }}>
                                {row.status}
                            </TableCell>
                            <TableCell align="center" sx={{ width: "10%" }}>
                                <span style={{ color: getStatusColor(row.online_status) }}> {row.online_status}  <br /> {row.last_action} </span>
                            </TableCell>
                            <TableCell align="left" >{row.last_status_change > 0 ? <TimeAgo date={row.last_status_change} formatter={customFormatter} /> : "N/A"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
    return (
        <Box
            sx={{
                border: '1px solid grey', // Adjust the width and color as needed
                padding: 1, // Optional: add padding inside the box
                borderRadius: 1, // Optional: to make corners rounded
            }}>
            <Stack spacing={1}>
                <h3>
                    <IconButton onClick={() => setOpen(!open)}>
                        <ExpandMoreIcon />
                    </IconButton>
                    {countryName}
                </h3>
                <Collapse in={open}>
                    {playersInCountry.length > 0
                        ? table
                        : (
                            <Box display="flex" alignItems="center" justifyContent="center" sx={{ padding: 1 }}>
                                <SentimentDissatisfiedIcon fontSize="large" sx={{ marginRight: 1 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Nobody's here
                                </Typography>
                            </Box>
                        )}
                </Collapse>
            </Stack>
        </Box>
    );
}