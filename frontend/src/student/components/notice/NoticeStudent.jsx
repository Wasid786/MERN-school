


import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios"
import { baseApi } from "../../../envirionment"
import { useState } from "react";
import { useEffect } from "react";
import Paper from "@mui/material/Paper";


export default function NoticeStudent (){
    const [notices, setNotices] = useState([])


   const fetchAllNotices = ()=>{
     axios.get(`${baseApi}/notice/student`).then(res=>{
        console.log(notices)
       setNotices(res.data.data)
     }).catch(e=>{
      console.log("Error in Fetcing All notice Data", e) 
     })
   }

   useEffect(()=>{
    fetchAllNotices()

   },[])


     return (
        <>

             <h1>Notice </h1>

  <Box component={'div'} sx={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>

    {notices && notices.map(x=>{
      return (
     
      <Paper key={x._id} sx={{m:2, p:2}}>
        
      <Box component={'div'}> 
         <Typography variant="h6"> <b>Title:</b>  {x.title}  </Typography>
        <Typography variant="h6"> <b>Message:</b>  {x.message}  </Typography>
               <Typography variant="h6"> <b>Audience: </b> {x.audience}    </Typography>
       
        </Box>
      
   

      </Paper>
      )
      
   
    })}
  </Box>

        </>
     )
}