import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { baseApi } from '../../../envirionment'

import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PieChart } from '@mui/x-charts/PieChart';

const convertDate = (dateData) => {
  const date = new Date(dateData);
  return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
}

const AttendanceDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const studentId = useParams().id;

  const [attendanceData, setAttendanceData] = useState([]);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  const fetchAttendanceDate = async () => {
    try {
      const response = await axios.get(`${baseApi}/attendance/${studentId}`);
      const data = response.data;
      setAttendanceData(data);

      let p = 0, a = 0;
      data.forEach(attend => {
        if (attend.status === "Present") p++;
        else if (attend.status === "Absent") a++;
      });

      setPresent(p);
      setAbsent(a);

    } catch (error) {
      console.log(error);
      navigate('/school/attendance');
    }
  };

  useEffect(() => {
    fetchAttendanceDate();
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
  }));

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      minHeight: '100vh',
      padding: 4,
    }}>
      <Box sx={{ mb: 2, fontSize: 24, fontWeight: 600 }}>Attendance Details</Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Item>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: present, label: 'Present' },
                    { id: 1, value: absent, label: 'Absent' },
                  ],
                },
              ]}
              width={300}
              height={300}
            />
          </Item>
        </Grid>

        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
            <Table sx={{ minWidth: 650 }} aria-label="attendance table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((x) => (
                  <TableRow key={x._id}>
                    <TableCell component="th" scope="row">
                      {convertDate(x.data)}
                    </TableCell>
                    <TableCell align="right">{x.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttendanceDetails;
