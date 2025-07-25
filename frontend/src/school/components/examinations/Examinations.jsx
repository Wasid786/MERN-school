import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import { examinationSchema } from '../../../yupSchema/examinationSchema';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { baseApi } from '../../../envirionment';
import MessageSnackBar from '../../../basicUtilityComponent/MessageSnackBar';




export default function Examinations() {
  
   const [examinations, setExaminations] = useState([])
   const [subjects, setSubjects ] = useState([])

   const initialValues =({
      date: "", 
      subject: "",
      examType :"", 
   })
    

   const formik = useFormik({
       initialValues: initialValues,
       validationSchema: examinationSchema,
 onSubmit: async (value) => {

  try {

    let URL = `${baseApi}/examination/create`

    if(editId){
     URL = `${baseApi}/examination/update/${editId}`
        
    }
      const response = await axios.post(URL, {
      date: value.date,
      subjectId: value.subject,
      classId: selectedClass,
      examType: value.examType
    })
    console.log("Examination new one ", response)


    // ✅ Show Snackbar only here
    setMessage(response.data.message)
    setMessageType('success')
    formik.resetForm()
  } catch (error) {
    console.log("Examination new one ", error)
    setMessage(error.response?.data?.message || "Something went wrong")
    setMessageType('error')
  }
}

   })

     // eslint-disable-next-line no-unused-vars
     const [age, setAge] = useState('');

  // eslint-disable-next-line no-unused-vars
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const fetchSubjects = async()=>{
    try {
      const response = await axios.get(`${baseApi}/subject/all`)
    console.log("Exam Subjects ", response)
    setSubjects(response.data.data)
    } catch (error) {
      console.log("Exam Subjects ", error)
    }
  }

  const [classes , setClasses] = useState([])



      const fetchClasses = async()=>{
    try {
      const response = await axios.get(`${baseApi}/class/all`)
        setClasses(response.data.data)
        setSelectedClass(response.data.data[0]._id)
        formik.resetForm()

    } catch (error) {
      console.log("Exam Subjects Error  ", error)
    }
  }
    
  const [ selectedClass, setSelectedClass] = useState("")


    const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success')

  const handleMessageClose = ()=>{
     setMessage('')
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
        const [editId, setEditId ] = useState(null)

        
   const handleEdit= (id)=>{
    setEditId(id);
    const selectedExamination = examinations.filter(x=>x._id === id);
    formik.setFieldValue("date", selectedExamination[0].examDate)
    formik.setFieldValue("subject", selectedExamination[0].subject._id)
    formik.setFieldValue("examType", selectedExamination[0].examType)

     
   }
      const handleDelete=async (id)=>{
        if(confirm("Are you Sure you Want to Delete?")){
          try {
              const response = await axios.delete(`${baseApi}/examination/delete/${id}`)
              setMessage(response.data.message)
              setMessageType("success")
              console.log("handleDelete", response)
          } catch (error) {
      console.log("Exam handleDelete ", error)
        setMessage("Error in Deleting Examination! ")
        setMessageType("error")
            
          }
        }
     
   }

   const handleEditCancel = ()=>{
    setEditId(null)
    formik.resetForm()
   }

  useEffect(()=>{
     fetchClasses()

  },[])


  useEffect(()=>{
     fetchSubjects() 
     fetchExaminations()
  },[message, selectedClass])



  return (
   <>
     {message &&    
         <MessageSnackBar
     message={message}
     messageType={messageType}
     handleClose={handleMessageClose}
   /> }
   

   <Paper sx={{marginBottom:"12px"}}>
    <Box>
          
      <FormControl  sx={{marginTop:"10px", minWidth:"210px "}}>
        <InputLabel id="demo-simple-select-label">Class </InputLabel>
        <Select
        onBlur={formik.handleChange}
      onChange={(e)=>{setSelectedClass(e.target.value)}}
      value={selectedClass}
        label="Class " variant="filled"
        >

     
        {formik.touched.subject && formik.errors.subject && (
    <p style={{ color: "red", textTransform: "capitalize", marginTop: "4px" }}>
      {formik.errors.subject}
    </p>
  )}

          {classes.map(c =>{
             return(
              <MenuItem key={c._id } value={c._id }> {c.class_text} </MenuItem>
             )
          })}

        </Select>
      </FormControl>
    </Box>
   </Paper>

   <Paper>
    <Box
      component="form"
      sx={{ width:"24vw", margin:"auto ", minWidth:"320px"}}
      noValidate
      autoComplete="off"
      onSubmit={formik.handleSubmit}
      
      
    >

    {editId ?    <Typography variant='h4'> Edit Exam </Typography>:    <Typography variant='h4'> Add New Exam </Typography>}
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DemoContainer components={['DatePicker']}>
    <DatePicker
      label="Basic date picker"
      value={formik.values.date ? dayjs(formik.values.date) : null}
      onChange={(newValue) => formik.setFieldValue('date', newValue)}
      slotProps={{ textField: { fullWidth: true } }} // This applies fullWidth to internal TextField
    />
  </DemoContainer>
</LocalizationProvider>

{formik.touched.date && formik.errors.date && (
  <p style={{ color: "red", textTransform: "capitalize", marginTop: "4px" }}>
    {formik.errors.date}
  </p>
)}










    <Box sx={{ minWidth: 120 }}>
      
      <FormControl fullWidth sx={{marginTop:"10px"}}>
        <InputLabel id="demo-simple-select-label">Subject</InputLabel>
        <Select
        name='subject'   
        onBlur={formik.handleChange}
      onChange={formik.handleChange}
      value={formik.values.subject}
        label="Subject" variant="filled"
        >

     
        {formik.touched.subject && formik.errors.subject && (
    <p style={{ color: "red", textTransform: "capitalize", marginTop: "4px" }}>
      {formik.errors.subject}
    </p>
  )}

          <MenuItem value={""}>Select Subjects </MenuItem>
          {subjects.map(subject =>{
             return(
              <MenuItem key={subject._id } value={subject._id }> {subject.subject_name} </MenuItem>
             )
          })}

        </Select>
      </FormControl>
    </Box>




      <TextField fullWidth name='examType'
       onBlur={formik.handleChange}
        sx={{marginTop:"30px"}}
        value={formik.values.examType}
      onChange={formik.handleChange}  label="Exam Type" variant="standard" />
        {formik.touched.examType && formik.errors.examType && (
    <p style={{ color: "red", textTransform: "capitalize", marginTop: "4px" }}>
      {formik.errors.examType}
    </p>
  )}

  <Button  sx={{marginTop:"15px"}} type='submit'variant='contained'> Submit  </Button>
  
 {editId && <Button  sx={{marginTop:"15px"}} type='buttton'variant='outlined' onClick={handleEditCancel}> Cancel  </Button>}
    </Box>
   </Paper>





  
    <TableContainer component={Paper}>
      <Box sx={{fontSize:"30px"}}>
         Examination 
      </Box>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
    <TableCell  align="right"> Exam Date </TableCell>
            <TableCell align="right">Subject </TableCell>
            <TableCell align="right">Exam Type  </TableCell>
            <TableCell align="right"> Actions </TableCell>
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
              <TableCell align="right">
                <Button variant='contained' sx={{background:'green'}} onClick={()=>{handleEdit(e._id)}}>Edit </Button>
                <Button variant='contained' sx={{background:'tomato'}} onClick={()=>{handleDelete(e._id)}}>Delete </Button>
              
              </TableCell>
            </TableRow>
            )
})}
        </TableBody>
      </Table>
    </TableContainer>

     </>
  );
}
