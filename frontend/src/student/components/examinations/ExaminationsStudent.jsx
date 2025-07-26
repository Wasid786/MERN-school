


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { baseApi } from '../../../envirionment';
import Typography from '@mui/material/Typography';




export default function ExaminationsStudent() {
  
   const [examinations, setExaminations] = useState([])

  const [ selectedClass, setSelectedClass] = useState("")
  const [className, setClassName]= useState('')




  const fetchExaminations =  async()=>{
 try {
  if( selectedClass){
    const response = await axios.get(`${baseApi}/examination/class/${selectedClass}`)
    console.log(" fetchExaminations ", response)
    setExaminations(response.data.examination)
     console.log(" fetchExaminations  after:  ", response.data.examination)
  }
    } catch (error) {
      console.log("Exam Subjects ", error)
    }
  }

  const dateFormat = (dateDate)=>{
    const date = new Date(dateDate)
  return date.getDate()+"-"+(+date.getMonth())+"-"+date.getFullYear()
  }

  

const fetchStudentDetails = async () => {
  try {
    const response = await axios.get(`${baseApi}/student/fetch-single`);
    console.log("Student Details: ", response.data);

    const student = response.data.students;

    if (student?.student_class?._id) {
  setSelectedClass(response.data.students.student_class._id);
    setClassName(response.data.students.student_class.class_text)

    } else {
      console.warn("Class ID not found in student object");
    }

  } catch (err) {
    console.error("fetchStudentDetails", err);
  }
};






  


        useEffect(()=>{
        fetchStudentDetails()

    }, [])


  useEffect(()=>{
     fetchExaminations()
  },[selectedClass])



  return (
   <>

 <Typography variant='h4' > Examination of your:  {className}</Typography>  
    <TableContainer component={Paper}>
      <Box sx={{fontSize:"30px"}}>
         Examination 
      </Box>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
<TableRow>
  <TableCell align="right" sx={{ fontWeight: "bold" }}>Exam Date</TableCell>
  <TableCell align="right" sx={{ fontWeight: "bold" }}>Subject</TableCell>
  <TableCell align="right" sx={{ fontWeight: "bold" }}>Exam Type</TableCell>
     </TableRow>

        </TableHead>
        <TableBody>
          {examinations && examinations.map((e) => {
            return (
                <TableRow 
              key={e._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell  align="right"> {dateFormat(e.examDate)} </TableCell>
              <TableCell align="right">{e.subject ? e.subject.subject_name:""}</TableCell>
              <TableCell align="right">{e.examType}</TableCell>
            </TableRow>
            )
})}
        </TableBody>
      </Table>
    </TableContainer>

     </>
  );
}
