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


export default function TravelTable({ countryName, playersInCountry }) {
    console.log(playersInCountry)
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
    const table = (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">ID</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="center">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {playersInCountry.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">
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
                                    {row.name}
                                </Typography>
                            </TableCell>
                            <TableCell align="center" style={{ color: getColor(row.color) }}>{row.status}</TableCell>
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