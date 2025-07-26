import Box from "@mui/material/Box";
import { useFormik } from "formik";
import { ClassSchema } from "../../../yupSchema/classSchema";
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
import { useTheme } from "@emotion/react";


export default function Class (){
    const [classes, setClasses] = useState([])
    const [edit, setEdit] = useState(false)
    const [editId, setEditId] = useState(null)


      const [message, setMessage] = useState('');
      const [messageType, setMessageType] = useState('success')
    
      const handleMessageClose = ()=>{
         setMessage('')
      }
    

    
    
    const handleEdit = (id, class_text, class_num) => {
        setEdit(true);
         setEditId(id);
        Formik.setFieldValue("class_text",class_text)
        Formik.setFieldValue("class_num",class_num)

  
    }

   const cancelEdit = () => {
 
             setEdit(false);
             setEditId(null)
        Formik.setFieldValue("class_text","")
        Formik.setFieldValue("class_num","")
    }

           const handleDelete = (id)=>{
        axios.delete(`${baseApi}/class/delete/${id}`).then(res=>{
          setMessage(res.data.message)
          setMessageType("success")
        }).catch(e=>{
          setMessage("Error in delete",e)
          setMessageType('error')
        })
    }


   const Formik = useFormik({
      initialValues: {class_text: "", class_num:""},
      validationSchema: ClassSchema,
      onSubmit:(values)=>{
          
         if(edit){

                  axios.patch(`${baseApi}/class/update/${editId}`, {...values}).then(res=>{
          setMessage(res.data.message )
          setMessageType('success')
          
         }).catch(e=>{
          console.log("Error in Class Updating",e)
          setMessage("Error in Updating ")
          setMessageType("error")
         })
         Formik.resetForm();
         }else{
              axios.post(`${baseApi}/class/create`, {...values}).then(res=>{
          console.log("Class add Response", res) 
          setMessage(res.data.message )
          setMessageType('success')
          
         }).catch(e=>{
          console.log("Error in Class Creating",e)
          setMessage("Error in Saving ")
          setMessageType("error")
         })
         Formik.resetForm();
         }

     
      }
   })
   const fetchAllClasses = ()=>{
     axios.get(`${baseApi}/class/all`).then(res=>{
       setClasses(res.data.data)
     }).catch(e=>{
      console.log("Error in Fetcing All Class Data", e) 
     })
   }

   useEffect(()=>{
    fetchAllClasses()

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

           

  <Box sx={{textAlign:"center", fontSize:"50px"}}>Class </Box>
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

{edit ? <Typography variant='h4' sx={{textAlign:"center"}}>Edit  Class </Typography> :
 <Typography variant='h4' sx={{textAlign:"center"}}>Add New  Class </Typography> 

}
  


        <TextField
         name='class_text'
        label="Class Text"
        value={Formik.values.class_text}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

      {Formik.touched.class_text 
      && Formik.errors.class_text &&
       <p style={{color:"red", textTransform:"capitalize"}}> {Formik.errors.class_text}</p>}


  <TextField
        type='string'
         name='class_num'
        label="Class Number"
        value={Formik.values.class_num}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

{Formik.touched.class_num && Formik.errors.class_num &&
  <p style={{color:"red", textTransform:"capitalize"}}>{Formik.errors.class_num}</p>
}

 
<Button type='submit' variant='contained'>Submit</Button>

{edit && 
  <Button onClick={() => cancelEdit()} type='button' variant='outlined'>Cancel</Button>
}

 
 
  
  </Box>
  <Box component={'div'} sx={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>

    {classes && classes.map(x=>{
      return (
     
      <Paper key={x._id} sx={{m:2, p:2}}>
        
      <Box component={'div'}> 
         <Typography variant="h6">
        Class: {x.class_text} [{x.class_num}]
       </Typography> </Box>
      
       <Box component={'div'}> 
        <Button onClick={()=>{handleEdit(x._id, x.class_text,x.class_num)}}>

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