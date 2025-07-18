import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { baseApi } from '../../../envirionment'

const AttendanceDetails = () => {
    const navigate = useNavigate()
        const studentId = useParams().id;

    const [attendanceData , setAttendanceData] = useState([])
    const fetchAttendanceDate = async()=>{
    try {
   const response =  await axios.get(`${baseApi}/attendance/${studentId}`)
     setAttendanceData(response.data)
   console.log("fetching attendance: ", response)

    } catch (error) {
        console.log(error)
        navigate('/school/attendace')
    }
    }

    useEffect(()=>{
        fetchAttendanceDate()



    }, [])


  return (
  <>
    <div>AttendanceDetails</div>
  </>
  )
}

export default AttendanceDetails