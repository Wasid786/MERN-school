import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { baseApi } from '../../../envirionment';
import CardMedia from '@mui/material/CardMedia';



export default function TeacherDetails() {
    const [teacherDetails, setTeacherDetails] = useState(null);

const fetchTeacherDetails = async () => {
  const response = await axios.get(`${baseApi}/teacher/fetch-single`);
  setTeacherDetails(response.data.teachers)
  console.log("teacher details", response.data.teachers);
}




    useEffect(()=> {
       fetchTeacherDetails()
    }, [])


  return (
    <> 
        {teacherDetails && <>


      <CardMedia
        component="img"
        image={`./images/uploaded/teacher/${teacherDetails.teacher_image}`}
        alt="Paella dish"
        sx={{height:"310px", width:"310px", margin:"auto",borderRadius:"50%" }}
      />
  


        

 <Box> Teachers </Box>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">

<TableBody>
  <TableRow>
    <TableCell>Name:</TableCell>
    <TableCell align="right">{teacherDetails.name}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell>Email:</TableCell>
    <TableCell align="right">{teacherDetails.email}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell>Age:</TableCell>
    <TableCell align="right">{teacherDetails.age}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell>Gender:</TableCell>
    <TableCell align="right">{teacherDetails.gender}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell>Qualification:</TableCell>
    <TableCell align="right">{teacherDetails.qualification}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell>Phone Number:</TableCell>
    <TableCell align="right">{teacherDetails.phone}</TableCell>
  </TableRow>
</TableBody>

      </Table>
    </TableContainer>
        </>
     }

     </>
  
  );
}
