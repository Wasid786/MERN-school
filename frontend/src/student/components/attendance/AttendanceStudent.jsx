

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { baseApi } from '../../../envirionment'

import { styled } from '@mui/material/styles';
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

const convertDate = (dateData)=>{
    const date = new Date(dateData);
    return date.getDate()+"-"+ (date.getMonth()+1) + "-"+ date.getFullYear()
}

const AttendanceStudent = () => {
    const [studentId , setStudentId] = useState(null);

    const navigate = useNavigate()
        // const studentId = useParams().id;



    // eslint-disable-next-line no-unused-vars
    const [attendanceData , setAttendanceData] = useState([])
    const [present , setPresent] = useState(0);
    const [absent, setAbsent ] = useState(0);

    const fetchAttendanceDate = async()=>{

    try {

   const response =  await axios.get(`${baseApi}/attendance/${studentId}`)
     setAttendanceData(response.data)

   console.log("fetching attendance: ", response)

      const respData =  response.data
        console.log("respData", respData)

      if(respData){
        console.log(respData)
          respData.forEach(attend =>{
      if (attend.status === "Present"){
        setPresent((prev) => prev +1)
      }else if (attend.status === "Absent"){
        setAbsent((prev) => prev +1)
      }
   }
)
      }

    } catch (error) {
        console.log(error)
        navigate('/school/attendance')
    }
    }

    const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));


const fetchStudentDetails = async () => {
  try {
    const { data } = await axios.get(`${baseApi}/student/fetch-single`);

    const id = data.student?._id || data.students?._id; 

    if (!id) {
      console.error("couldn't find ._id in", data);
      return;
    }

    setStudentId(id);
  } catch (err) {
    console.error(err);
  }
}





  


        useEffect(()=>{
        fetchStudentDetails()

    }, [])

useEffect(() => {
  if (studentId) {
    fetchAttendanceDate();
  }
}, [studentId]); 


  return (
  <>
    <div>AttendanceDetails</div>

    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={6}>
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
      width={200}
      height={200}
    />
             </Item>
        </Grid>
 <Grid size={6}>
              <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date </TableCell>
            <TableCell align="right">Status </TableCell>
  
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceData.map((x) => (
            <TableRow
              key={x._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">      {convertDate(x.date) }  </TableCell>
              <TableCell align="right">{x.status}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </Grid>

      </Grid>
    








    </Box>



  </>
  )
}

export default AttendanceStudent