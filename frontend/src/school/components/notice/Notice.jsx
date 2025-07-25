import Box from "@mui/material/Box";
import { useFormik } from "formik";
import { NoticeSchema } from "../../../yupSchema/noticeSchema";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios"
import { baseApi } from "../../../envirionment"
import { useState } from "react";
import { useEffect } from "react";
import EditIcon  from "@mui/icons-material/Edit"
import DeleteIcon  from "@mui/icons-material/Delete"
import MessageSnackBar from '../../../basicUtilityComponent/MessageSnackBar';
import Paper from "@mui/material/Paper";
import { FormControl, InputLabel, MenuItem, Select, useTheme } from "@mui/material";


export default function Notice (){
    const [notices, setNotices] = useState([])
    const [edit, setEdit] = useState(false)
    const [editId, setEditId] = useState(null)


      const [message, setMessage] = useState('');
      const [messageType, setMessageType] = useState('success')
    
      const handleMessageClose = ()=>{
         setMessage('')
      }
    

    
    
    const handleEdit = (id, title, message, audience) => {
        console.log("handle edit ", id)
        setEdit(true);
         setEditId(id);
        Formik.setFieldValue("title",title)
        Formik.setFieldValue("message",message)
        Formik.setFieldValue("audience",audience)


    }

   const cancelEdit = () => {
             setEdit(false);
             setEditId(null)
              Formik.resetForm()
    }

           const handleDelete = (id)=>{
        console.log("handle Delete ")
        axios.delete(`${baseApi}/notice/delete/${id}`).then(res=>{
          setMessage(res.data.message)
          setMessageType("success")
            console.log("---------handle Delete---------- ",res.data.message)
        }).catch(e=>{
          setMessage("Error in delete",e)
          setMessageType('error')
           console.log("---------handle Delete---------- ",e.message)
        })
    }


   const Formik = useFormik({
      initialValues: {title: "", message:"", audience:""},
      validationSchema: NoticeSchema,
      onSubmit:(values)=>{
         console.log(values)
          
         if(edit){

                  axios.patch(`${baseApi}/notice/update/${editId}`, {...values}).then(res=>{
          console.log("Notice add Response", res) 
          setMessage(res.data.message )
          setMessageType('success')
          
         }).catch(e=>{
          console.log("Error in notice Updating",e)
          setMessage("Error in Updating ")
          setMessageType("error")
         })
         Formik.resetForm();
         }else{
              axios.post(`${baseApi}/notice/create`, {...values}).then(res=>{
          console.log("notice add Response", res) 
          setMessage(res.data.message )
          setMessageType('success')
          
         }).catch(e=>{
          console.log("Error in notice Creating",e)
          setMessage("Error in Saving ")
          setMessageType("error")
         })
         Formik.resetForm();
         }

     
      }
   })
   const fetchAllNotices = ()=>{
     axios.get(`${baseApi}/notice/all`).then(res=>{
       setNotices(res.data.data)
     }).catch(e=>{
      console.log("Error in Fetcing All notice Data", e) 
     })
   }

   useEffect(()=>{
    fetchAllNotices()

   },[message])

   const theme = useTheme();


     return (
        <>
               {message &&    
                   <MessageSnackBar
               message={message}
               messageType={messageType}
               handleClose={handleMessageClose}
             /> }

             <h1>Notice </h1>


    {edit ? <Typography variant='h3' sx={{textAlign:"center"}}>Edit  Notice </Typography> :
 <Typography variant='h3' sx={{textAlign:"center"}}>Add New  Notice </Typography> 

}
  <Box
  component="form"
  sx={{
    '& > :not(style)': { m: 1 },
    display: 'flex',
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper, 
    color: theme.palette.text.primary,              
    width: '50vw',
    minWidth: '230px',
    margin: "auto",
    padding: '20px',
    borderRadius: '10px',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 0 10px rgba(255,255,255,0.1)'
      : '0 0 10px rgba(0,0,0,0.1)',                
  }}
  noValidate
  autoComplete="off"
  onSubmit={Formik.handleSubmit}
>


  


        <TextField
         name='title'
        label="Notice Title "
        value={Formik.values.title}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

      {Formik.touched.title 
      && Formik.errors.title &&
       <p style={{color:"red", textTransform:"capitalize"}}> {Formik.errors.title}</p>}


  <TextField
      multiline
      rows={5}
        type='string'
         name='message'
        label="Notice Message"
        value={Formik.values.message}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

{Formik.touched.message && Formik.errors.message &&(
   <p style={{color:"red", textTransform:"capitalize"}}>{Formik.errors.message}</p>
)
}


<FormControl  sx={{marginTop:"10px", minWidth:"210px "}}>
        <InputLabel id="demo-simple-select-label">Audience </InputLabel>
        <Select
        name="audience"
        onBlur={Formik.handleChange}
      onChange={Formik.handleChange}
      value={Formik.values.audience}
        label=" Select Audience "
         variant="filled"
        >
             <MenuItem value={""} >Select Audience </MenuItem>
             <MenuItem  value={"teacher"}>Teacher </MenuItem>
            <MenuItem  value={"student"}>Student </MenuItem>



          

                  {Formik.touched.audience && Formik.errors.audience && (
    <p style={{ color: "red", textTransform: "capitalize", marginTop: "4px" }}>
      {Formik.errors.audience}
    </p>
  )}


        </Select>
      </FormControl>


 
<Button type='submit' variant='contained'>Submit</Button>

{edit && 
  <Button onClick={() => cancelEdit()} type='button' variant='outlined'>Cancel</Button>
}

 
 
  
  </Box>
  <Box component={'div'} sx={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>

    {notices && notices.map(x=>{
      return (
     
      <Paper key={x._id} sx={{m:2, p:2}}>
        
      <Box component={'div'}> 
         <Typography variant="h6"> <b>Title:</b>  {x.title}  </Typography>
        <Typography variant="h6"> <b>Message:</b>  {x.message}  </Typography>
               <Typography variant="h6"> <b>Audience: </b> {x.audience}    </Typography>
       
        </Box>
      
       <Box component={'div'}> 
        <Button onClick={()=>{handleEdit(x._id, x.title,x.message , x.audience)}}>

          <EditIcon/> 
        </Button>
          <Button onClick={()=>handleDelete(x._id)} sx={{color:"red"}}>
          <DeleteIcon/> 
        </Button>
       </Box>

      </Paper>
      )
      
   
    })}
  </Box>

        </>
     )
}