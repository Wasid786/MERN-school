
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import MessageSnackBar from "../../../basicUtilityComponent/MessageSnackBar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { baseApi } from "../../../envirionment"





import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Grid } from "@mui/material";
import { styled } from '@mui/material/styles';



export default function AttendanceStudentList() {


    const[classes, setClasses] = useState([])

      

   // eslint-disable-next-line no-unused-vars
   const [message, setMessage] = useState('');

 
  const fetchClasses = ()=>{
      axios.get(`${baseApi}/class/all`).then(res=>{
         setClasses(res.data.data);
      }).catch(e=>{
         console.log(e, "Error while Fetching Class Data")
      })
  }
const [params, setParams] = useState({})

   const handleClass = (e)=>{
    setParams((prevParams)=>({
      ...prevParams,
      student_class: e.target.value || undefined
    }))
   }

   const handleSearch = (e)=>{
    setParams((prevParams)=>({
      ...prevParams,
      search: e.target.value || undefined
    }))
   }
   const [students, setStudents]  = useState([])



  const fetchStudents = ()=>{
      axios.get(`${baseApi}/student/fetch-query`,{params}).then(res=>{
              console.log("Response Student", res)
         setStudents(res.data.students)
         fetchAttendanceForStudents(res.data.students)
         console.log(res);
   
         
      }).catch(e=>{
         console.log(e, " Error while Fetching Data")
      })
  }





  useEffect(()=>{
      fetchClasses()
  
  },[])

  useEffect(()=>{
      fetchStudents()
  }, [message, params])






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



const [attendanceDate , setAttendanceDate] = useState({})

const fetchAttendanceForStudents = async (studentList) => {
  const attendancePromises = studentList.map((student) =>
    fetchAttendanceForStudent(student._id)
  );

  const results = await Promise.all(attendancePromises);

  const updatedAttendanceDate = {};
  results.forEach(({ studentId, attendancePercentage }) => {
    updatedAttendanceDate[studentId] = attendancePercentage;
  });

  setAttendanceDate(updatedAttendanceDate);
};


const fetchAttendanceForStudent =  async(studentId)=>{
  try {
     const response = await axios.get(`${baseApi}/attendance/${studentId}`);
     const attendanceRecords = response.data 
     const totalClasses =attendanceRecords.length;
     const percentCount = attendanceRecords.filter(
      (record)=> record.status === "Present"
     ).length
     const attendancePercentage = totalClasses > 0? (percentCount /totalClasses) *100 : 0;
     return {studentId, attendancePercentage};
  } catch (error) {
    console.error(`Error while fetching attendance ${studentId}: `, error)
    return {studentId, attendancePercentage : 0}
    
  }
}



  return (
    <>
    <Box component={'div'}  
    sx={{
      // background:"url(https://cdn.pixabay.com/photo/2017/08/12/21/42/back2 -2635456_1280.png)",
      backgroundSize: "cover",
      backgroundRepeat:"no-repeat",
      height:"100%",
      paddingTop:"60px",
      paddingBottom:"60px"
    }}> 

{/* 
  {message &&    
      <MessageSnackBar
  message={message}
  messageType={messageType}
  handleClose={handleMessageClose}
/> } */}
{/* {edit ? <Typography variant='h2' sx={{textAlign:"center"}}>Edit Student</Typography> :  */}
<Typography variant='h2' sx={{textAlign:"center"}}> Student Attendance </Typography>
{/* } */}

  <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 4 }}>
          <Item>

                <Box component={'div'} sx={{display:"flex", flexDirection:"row", justifyContent:"center", marginTop:"40px"}}>
  <TextField

        label="Search"
        value={params.search || ''}
        onChange={(e)=>{
          handleSearch(e)
        }}
        />


  <FormControl sx={{ mb: 2, width:"230px" }}>
  <InputLabel>Student Class</InputLabel>
  <Select 
    label="Student Class"  
    onChange={(e)=>{handleClass(e)}}
    value={params.student_class || ''}
  >
    <MenuItem value="">Select Classes</MenuItem>
    {classes.map(cls => (
      <MenuItem key={cls._id} value={cls._id}>
        {cls.class_text} ({cls.class_num})
      </MenuItem>
    ))}
  </Select>
</FormControl>
    </Box>



          </Item>
        </Grid>
        <Grid size={{ xs: 6, md: 8 }}>
          <Item>
                <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell> Name </TableCell>
            <TableCell align="right">Gender </TableCell>
            <TableCell align="right">Guardian Phone&nbsp;(g)</TableCell>
            <TableCell align="right">Class &nbsp;(g)</TableCell>
            <TableCell align="right">Percentage &nbsp;(g)</TableCell>
            <TableCell align="right">View  </TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          { students && students.map((student) => (
            <TableRow
              key={student._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {student.name}
              </TableCell>
                       <TableCell align="right">{student.gender}</TableCell>
              <TableCell align="right">{student.guardian_phone}</TableCell>
     
              <TableCell align="right">{student.student_class.class_text}</TableCell>

              <TableCell align="right">
                {attendanceDate[student._id] !== undefined ? `${attendanceDate[student._id].toFixed(2)}%` : "No Data"}

              </TableCell>
              <TableCell align="right">"View </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </Item>
        </Grid>
      </Grid>
  
    












</Box>
      </>
  );
}