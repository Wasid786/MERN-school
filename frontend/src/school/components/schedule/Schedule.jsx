import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'
import ScheduleEvent from './ScheduleEvent'
import {Button, FormControl, InputLabel, MenuItem, Select} from '@mui/material'
import axios from 'axios'
import { baseApi } from '../../../envirionment'
import MessageSnackBar from "../../../basicUtilityComponent/MessageSnackBar";

const localizer = momentLocalizer(moment)

export default function Schedule() {

        const [message, setMessage] = useState('');
      const [messageType, setMessageType] = useState('success')
    
      const handleMessageClose = ()=>{
         setMessage('')
      }

      const handleMessageNew = (msg, type)=>{
        setMessage(msg)
        setMessageType(type)
      }
    


   const [newPeriod , setNewPeriod] = useState(false);
   const [classes, setClasses] = useState([])
   const [selectedClass, setSelectedClass] = useState("")


  const handleEventClose = ()=>{
    setNewPeriod(false)
  }

  const [events, setEvent ] = useState([])

  useEffect(()=>{
    axios.get(`${baseApi}/class/all`).then(res => {
  const classList = res.data.data;
  setClasses(classList);

  if (classList.length > 0) {
    setSelectedClass(classList[0]._id); 
  }
}).
catch(e=>{
      console.log("Fetch class Error", e);
     })
  },[])

useEffect(() => {
  if (selectedClass) {
    axios.get(`${baseApi}/schedule/fetch-with-class/${selectedClass}`).then(res=>{
      console.log(res.data.data)
      const respData = res.data.data.map(x =>{
        return ({
          id:x._id, 
          title: `Sub: ${x.subject.subject_name}, Teacher: ${x.teacher.name}`, 
          start: new Date(x.startTime),
          end: new Date(x.endTime) 

        })
      })
      setEvent(respData);
    })
     
      .catch(e => {
        console.log("Error in fetching Schedule ", e);
      });
  }
}, [selectedClass , message]);

const handleSelectEvent= (e)=>{
  console.log(e)
}



  return (
    <div >
           {message &&    <MessageSnackBar
                   message={message}
                   messageType={messageType}
                   handleClose={handleMessageClose}
                 /> }
      <h1>Schedule</h1>

      <FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel id="class-label">Classes  </InputLabel>
  <Select
    label="Subject"
    value={selectedClass}
    onChange={(e)=>{
      setSelectedClass(e.target.value)

    }}
  >
     {classes && classes.map(x=>{
      return (

          <MenuItem key={x._id} value={x._id}> {x.class_text}  </MenuItem>
      )

   })}
  </Select>


</FormControl>

      <Button onClick={()=>setNewPeriod(true)}>
     Add New Period 
      </Button>
    
    {newPeriod && <ScheduleEvent selectedClass = {selectedClass} handleEventClose={handleEventClose}
     handleMessageNew = {handleMessageNew}
    />}
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={[ 'week','day', 'agenda']}
          step={30}
          timeslots={1}
          min={new Date(1970, 1, 1, 10, 0, 0)}
         startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          max={new Date(1970, 1, 1, 17, 0, 0)}
          defaultDate={new Date()}
          showMultiDayTimes
          
          style={{height:'100%', width:'100%'}}
        />
     
    </div>
  )
}