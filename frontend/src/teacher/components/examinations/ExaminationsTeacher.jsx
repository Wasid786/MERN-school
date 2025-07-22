
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

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { baseApi } from '../../../envirionment';




export default function ExaminationsTeacher() {
  
   const [examinations, setExaminations] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [classes , setClasses] = useState([])
  const [ selectedClass, setSelectedClass] = useState("")



      const fetchClasses = async()=>{
    try {
      const response = await axios.get(`${baseApi}/class/all`)
        setClasses(response.data.data)
        setSelectedClass(response.data.data[0]._id)

    } catch (error) {
      console.log("Exam Subjects Error  ", error)
    }
  }
    
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

  


  useEffect(()=>{
     fetchClasses()

  },[])


  useEffect(()=>{
     fetchExaminations()
  },[selectedClass])



  return (
   <>
   <Paper sx={{marginBottom:"12px"}}>
    <Box>
          
      <FormControl  sx={{marginTop:"10px", minWidth:"210px "}}>
        <InputLabel id="demo-simple-select-label">Class </InputLabel>
        <Select
      onChange={(e)=>{setSelectedClass(e.target.value)}}
      value={selectedClass}
        label="Class " variant="filled"
        >

     

          {classes.map(c =>{
             return(
              <MenuItem key={c._id } value={c._id }> {c.class_text} </MenuItem>
             )
          })}

        </Select>
      </FormControl>
    </Box>
   </Paper>
  
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
