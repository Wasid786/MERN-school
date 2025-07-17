import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { useFormik } from "formik";
import { periodSchema } from "../../../yupSchema/periodSchema";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../envirionment";
import dayjs from 'dayjs';


import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const ScheduleEvent = ({selectedClass, handleEventClose, handleMessageNew}) => {

  
const period = [
  { id: 1, label: 'Period 1 (10:00AM - 11:00AM)', startTime: '10:00', endTime: '11:00' },
  { id: 2, label: 'Period 2 (11:00AM - 12:00PM)', startTime: '11:00', endTime: '12:00' },
  { id: 3, label: 'Period 3 (12:00PM - 01:00PM)', startTime: '12:00', endTime: '13:00' },
  { id: 99, label: '🍱 Lunch Break (01:00PM - 02:00PM)', startTime: '13:00', endTime: '14:00' }, 
  { id: 4, label: 'Period 4 (02:00PM - 03:00PM)', startTime: '14:00', endTime: '15:00' },
  { id: 5, label: 'Period 5 (03:00PM - 04:00PM)', startTime: '15:00', endTime: '16:00' },
];


const [teachers, setTeachers ] = useState([])
const [subjects, setSubjects] = useState([])






  const initialValues = {
    teacher:"",
    subject:"",
    period:"",
    date :dayjs(),
    
  }

  const formik = useFormik({
  initialValues,
  validationSchema:periodSchema,
onSubmit: (value) => {
  let [startTime, endTime] = value.period.split(',').map(s => s.trim());

  const start = value.date.hour(startTime.split(':')[0]).minute(startTime.split(':')[1]).second(0).toDate();
  const end = value.date.hour(endTime.split(':')[0]).minute(endTime.split(':')[1]).second(0).toDate();

  const payload = {
    ...value,
    selectedClass,
    startTime: start,
    endTime: end
  };

  axios.post(`${baseApi}/schedule/create`, payload)
    .then(res => {
      console.log("response", res)
      formik.resetForm()
      handleMessageNew(res.data.message, "success")
      handleEventClose()

     
    })
    .catch((e) => {
      console.log("Error", e);
      handleMessageNew("Error in creating new Schedule", "success")
    });
}



});

const fetchData = async()=>{
try {
    const teacherResponse = await axios.get(`${baseApi}/teacher/fetch-query`, {params:{}})
  const subjectResponse = await axios.get(`${baseApi}/subject/all`);

  setTeachers(teacherResponse.data.teachers);
  setSubjects(subjectResponse.data.data);
  console.log(teacherResponse.data.teacher);
  
} catch (error) {
   console.log(error)
}


}

useEffect(()=>{
  fetchData()
     
},[])

  return (
    <>

       <Box
      component="form"
      sx={{ '& > :not(style)':  { m: 1 }, 
      display:'flex', flexDirection:"column",background : "#fff", width:'50vw', minWidth:'230px', margin:"auto" }}
      noValidate
      autoComplete="off"
      
      onSubmit={formik.handleSubmit}>
      <Typography variant="h4" sx={{textAlign:'center'}} > Add New Period  </Typography>







<FormControl fullWidth sx={{ mb: 2 }} error={Boolean(formik.touched.teacher && formik.errors.teacher)}>
  <InputLabel id="class-label">Teachers </InputLabel>
  <Select
    name="teacher"
    label="Teacher"
    value={formik.values.teacher}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  >
     {teachers && teachers.map(x=>{
      return (

          <MenuItem key={x._id} value={x._id}> {x.name}  </MenuItem>
      )

   })}
  </Select>

  {formik.touched.teacher && formik.errors.teacher && (
    <p style={{ color: "red", textTransform: "capitalize", marginTop: "4px" }}>
      {formik.errors.teacher}
    </p>
  )}
</FormControl>




<FormControl fullWidth sx={{ mb: 2 }} error={Boolean(formik.touched.subject && formik.errors.subject)}>
  <InputLabel id="class-label">Subjects </InputLabel>
  <Select

    name="subject"
    label="Subjects"
    value={formik.values.subject}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  >
     {subjects && subjects.map(x=>{
      return (

          <MenuItem key={x._id} value={x._id}> {x.subject_name}</MenuItem>
      )

   })}
  </Select>

  {formik.touched.subject && formik.errors.subject && (
    <p style={{ color: "red", textTransform: "capitalize", marginTop: "4px" }}>
      {formik.errors.subject}
    </p>
  )}
</FormControl>




<FormControl fullWidth sx={{ mb: 2 }} error={Boolean(formik.touched.period && formik.errors.period)}>
  <InputLabel id="class-label">Period </InputLabel>
  <Select

    name="period"
    label="Periods"
    value={formik.values.period}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  >
     {period && period.map(x=>{
      return (

          <MenuItem key={x._id} value={`${x.startTime}, ${x.endTime}}`}> {x.label} </MenuItem>
      )

   })}
  </Select>

  {formik.touched.period && formik.errors.period && (
    <p style={{ color: "red", textTransform: "capitalize", marginTop: "4px" }}>
      {formik.errors.period}
    </p>
  )}
</FormControl>



    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer  components={['DatePicker']}>
     <DatePicker
  label="Basic date picker"
  value={formik.values.date? dayjs(formik.values.data): null}
  onChange={(newValue) => formik.setFieldValue('date', newValue)}
/>

      </DemoContainer>
    </LocalizationProvider>

 

<Button type="submit" variant="contained" >Submit </Button>

 
    </Box>
    </>
  )
}



export default ScheduleEvent