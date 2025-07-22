/* eslint-disable no-unused-vars */
import axios from "axios"
import { useEffect, useState } from "react"
import { baseApi } from '../../../envirionment'
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Alert from "@mui/material/Alert"
import CheckIcon from '@mui/icons-material/Check';
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import Button from "@mui/material/Button"
import MessageSnackBar from "../../../basicUtilityComponent/MessageSnackBar"


export default function AttendanceTeacher(){
    const [classes, setClasses] = useState([])
    const [selectedClass, setSelectedClass] = useState("")
        const [attendanceStatus, setAttendanceStatus]= useState({})

    const fetchAttendeeClass = async()=>{
try {
      const response = await     axios.get(`${baseApi}/class/attendee`)
      console.log(response)
      setClasses(response.data.data)
      
       if(response.data.data.length > 0){
        setSelectedClass(response.data.data[0]._id)
       }    
} catch (error) {
    console.log("fetchAttendeeClass",error)
}
    }



       const [students, setStudents]  = useState([])

      const handleAttendance =({studentId, status})=>{
        setAttendanceStatus((prevStatus)=> ({...prevStatus, [studentId]: status}))

      }


const singleStudentAttendance = async(studentId, status)=>{
    try { 
     const response =  await axios.post(`${baseApi}/attendance/mark`, {studentId,date: new Date(), classId:selectedClass, status})
       console.log('marking attendance', response)
        
    } catch (error) {
            console.log("singleStudentAttendance",error)
    }
}

      const submitAttendance =async ()=>{
         try {
            await Promise.all(students.map((student)=>
                singleStudentAttendance(student._id, attendanceStatus[student._id])
            ))
            setMessage("Attendance Submitted  Successfully!")
            setMessageType("success")
            
         } catch (error) {
               console.log("submitAttendance",error)
                      setMessage("Attendance Submition  Failed!")
                        setMessageType("error")
         }
      }


      const [message, setMessage] = useState('');
      const [messageType, setMessageType] = useState('success')
    
      const handleMessageClose = ()=>{
         setMessage('')
      }

      const [attendanceChecked, setAttendanceCheck] = useState(false)


      const checkAttendanceAndFetchStudents =async()=>{
        try {
              if( selectedClass){
             const responseStudent = await axios.get(`${baseApi}/student/fetch-query`, { params: { student_class: selectedClass }})
             console.log("student fetch-query ", responseStudent)
            const responseCheck = await  axios.get(`${baseApi}/attendance/check/${selectedClass}`)
             console.log("selectedClass ", responseCheck)

             if(!responseCheck.data.attendanceTaken){
                    setStudents(responseStudent.data.students)
             responseStudent.data.students.forEach(student =>{
             handleAttendance(student._id, 'Present')

             })
             }else{
                setAttendanceCheck(true)
                //  setMessage("Today's Attendance Already Marked!")
                //         setMessageType("error")
             }
         }
            
        } catch (error) {
            
           console.log("checkAttendance",error)
                      
        }


      }

    

    useEffect(()=>{
        fetchAttendeeClass()
    },[])


    useEffect(()=>{
        checkAttendanceAndFetchStudents()
    },[selectedClass, message])

    return (

        <>
                {message &&    
                           <MessageSnackBar
                       message={message}
                       messageType={messageType}
                       handleClose={handleMessageClose}
                     /> }

        <h1>Teacher Attendance </h1>
        { classes.length > 0 ?  <Paper sx={{marginBottom:"12px"}}>
    <Box>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              You Attendee of {classes.length} Classes.
    </Alert>
          
      <FormControl  sx={{marginTop:"10px", minWidth:"210px "}}>
        <InputLabel id="demo-simple-select-label">Class </InputLabel>
        <Select
      onChange={(e)=>{setSelectedClass(e.target.value); setAttendanceCheck(false)} }
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
   :  <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
              You Not Attendee of Any Class.
    </Alert>
        
    }
  
   {students.length >0  ? 
               <TableContainer component={Paper}>
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
           <TableHead>
             <TableRow>
               <TableCell align="right">Name </TableCell>
               <TableCell align="right">Action </TableCell>

     
             </TableRow>
           </TableHead>
           <TableBody>
             {students.map((x) => (
               <TableRow
                 key={x._id}
                 sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
               >
                 <TableCell sx={{fontWeight:"bold"}}  align="right">      {x.name} </TableCell>
                 <TableCell sx={{fontWeight:"bold"}} align="right">
                   
                    <FormControl  sx={{marginTop:"10px", minWidth:"210px "}}>
                         <InputLabel> Attendance</InputLabel>
        <Select
onChange={(e)=> handleAttendance({ studentId: x._id, status: e.target.value })}

   value={attendanceStatus[x._id] || ""}

        label="Attendance " variant="filled"
        >

       <MenuItem value={"Present"}> Present </MenuItem>
       <MenuItem value={"Absent"}> Absent </MenuItem>


        </Select>
      </FormControl>
                    
                      </TableCell>
                 
               </TableRow>
             ))}
           </TableBody>
         </Table>
         <Button variant="contained" onClick={submitAttendance}> Take Attandace </Button>
       </TableContainer>
   : <>
        {attendanceChecked ?    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            Today's Attendance Already Taken 
    </Alert> :<Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
              There is no Student in Your Class.
    </Alert>
    }

        
   </>
    
    }
   
  

     </>
        
    )
}