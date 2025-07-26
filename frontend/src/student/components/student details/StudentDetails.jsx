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



export default function StudentDetails() {
    const [studentDetails, setStudentDetails] = useState(null);

const fetchStudentDetails = async () => {
  const response = await axios.get(`${baseApi}/student/fetch-single`);
  setStudentDetails(response.data.students)
}




    useEffect(()=> {
       fetchStudentDetails()
    }, [])


  return (
    <> 
        {studentDetails && <>


      <CardMedia
        component="img"
        image={`./images/uploaded/student/${studentDetails.student_image}`}
        alt="Paella dish"
        sx={{height:"310px", width:"310px", margin:"auto",borderRadius:"50%" }}
      />
  


        

 <Box> students </Box>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">

<TableBody>
  <TableRow>
    <TableCell><b>Name:</b></TableCell>
    <TableCell align="right">{studentDetails.name}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell><b>Email</b>:</TableCell>
    <TableCell align="right">{studentDetails.email}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell><b>Age</b>:</TableCell>
    <TableCell align="right">{studentDetails.age}</TableCell>
  </TableRow>
    <TableRow>
    <TableCell><b>Class</b>:</TableCell>
    <TableCell align="right">{studentDetails.student_class.class_text }</TableCell>
  </TableRow>

  <TableRow>
    <TableCell><b>Gender</b>:</TableCell>
    <TableCell align="right">{studentDetails.gender}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell> <b>Guardian</b> :</TableCell>
    <TableCell align="right">{studentDetails.guardian}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell> <b>Guardian Phone Number</b>:</TableCell>
    <TableCell align="right">{studentDetails.guardian_phone}</TableCell>
  </TableRow>
</TableBody>

      </Table>
    </TableContainer>
        </>
     }

     </>
  
  );
}
