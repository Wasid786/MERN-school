import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { baseApi } from '../../../envirionment'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'

const Attendee = ({classId, handleMessage , message}) => {
  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [attendee, setAttendee] = useState(null)
  


  

  const fetchClassDetails = async()=>{
    if (classId){
        try {
   const resopnse =  await  axios.get(`${baseApi}/class/single/${classId}`)
   setAttendee(resopnse.data.data.attendee ? resopnse.data.data.attendee : null )
   console.log("fetching single class: ", resopnse)
          
        } catch (error) {
          console.log(error)
          
        }
    }
  }



  const handleSubmit =async ()=>{
        try {

                if( selectedTeacher){
                  const response = await  axios.patch(`${baseApi}/class/update/${classId}`, {attendee: selectedTeacher})
                 console.log(response , "  submit attendee ")
              handleMessage("Success in selecting Attendee", "success")
                }else{
                   alert("Please Select Teacher !")
                }
            
        } catch (error) {
            console.log("Error ", error)
        }
  }



        const fetchTeachers = async()=>{
    await axios.get(`${baseApi}/teacher/fetch-query`,{params:{}}).then(res=>{
              console.log("Response Teacher",res)
         setTeachers(res.data.teachers)
   
         
      }).catch(e=>{
         console.log(e, " Error while Fetching Data")
      })
  }

      useEffect(()=>{
        fetchClassDetails()
        fetchTeachers()
    },[classId, message])


  return (
    <>
    
    <div >Attendee</div>
 
    <Box >
      { attendee &&    <Box component={'div'}  sx={{ display:"flex", flexDirection:"row" , justifyContent:"center"}}>
      <Typography variant='h5'> Attendee Teacher :    </Typography>
      <Typography variant='h5' >    {attendee.name} </Typography>
    </Box>
    }
          <FormControl sx={{ mb: 2, width:"230px" ,}}>
  <InputLabel>Select Teacher</InputLabel>
  <Select 
    label="Select Teacher"  
    onChange={(e)=>{setSelectedTeacher(e.target.value)}}
    value={selectedTeacher}
  >
    <MenuItem value="">Select teachers</MenuItem>
    {teachers && teachers.map(cls => (
      <MenuItem key={cls._id} value={cls._id}>
        {cls.name} 
      </MenuItem>
    ))}
  </Select>
</FormControl>
  
  <Button variant="contained" onClick={handleSubmit}>
   {attendee ?  "Change Attendee": "Select Attendee"}
</Button>

    </Box>
    </>

  )
}

export default Attendee