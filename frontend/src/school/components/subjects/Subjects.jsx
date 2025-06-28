import Box from "@mui/material/Box";
import { useFormik } from "formik";
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
import { subjectSchema } from "../../../yupSchema/subjectSchema";


export default function Subjects (){
    const [subjects, setSubjects] = useState([])
    const [edit, setEdit] = useState(false)
    const [editId, setEditId] = useState(null)
//  const [editingsubject, setEditingsubject] = useState(null)


      const [message, setMessage] = useState('');
      const [messageType, setMessageType] = useState('success')
    
      const handleMessageClose = ()=>{
         setMessage('')
      }
    

    
    
    const handleEdit = (id, subject_name, subject_codename) => {
        console.log("handle edit ", id)
        setEdit(true);
         setEditId(id);
        Formik.setFieldValue("subject_name",subject_name)
        Formik.setFieldValue("subject_codename",subject_codename)


    }

   const cancelEdit = () => {
        // setEdit(false)
        // setEditingsubject(null)
        // Formik.resetForm()
             setEdit(false);
             setEditId(null)
        Formik.setFieldValue("subject_name","")
        Formik.setFieldValue("subject_codename","")
    }

           const handleDelete = (id)=>{
        console.log("handle Delete ")
        axios.delete(`${baseApi}/subject/delete/${id}`).then(res=>{
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
      initialValues: {subject_name: "", subject_codename:""},
      validationSchema: subjectSchema,
      onSubmit:(values)=>{
         console.log(values)
          
         if(edit){

                  axios.patch(`${baseApi}/subject/update/${editId}`, {...values}).then(res=>{
          console.log("subject add Response", res) 
          setMessage(res.data.message )
          setMessageType('success')
          
         }).catch(e=>{
          console.log("Error in subject Updating",e)
          setMessage("Error in Updating ")
          setMessageType("error")
         })
         Formik.resetForm();
         }else{
              axios.post(`${baseApi}/subject/create`, {...values}).then(res=>{
          console.log("subject add Response", res) 
          setMessage(res.data.message )
          setMessageType('success')
          
         }).catch(e=>{
          console.log("Error in subject Creating",e)
          setMessage("Error in Saving ")
          setMessageType("error")
         })
         Formik.resetForm();
         }

     
      }
   })
   const fetchAllsubjects = ()=>{
     axios.get(`${baseApi}/subject/all`).then(res=>{
       setSubjects(res.data.data)
     }).catch(e=>{
      console.log("Error in Fetcing All subject Data", e) 
     })
   }

   useEffect(()=>{
    fetchAllsubjects()

   },[message])


     return (
        <>
               {message &&    
                   <MessageSnackBar
               message={message}
               messageType={messageType}
               handleClose={handleMessageClose}
             /> }

           <Typography variant="h3" sx={{textAlign:'center', fontWeight:"700"}}> Subjects</Typography>

    <Box
      component="form"
      sx={{ '& > :not(style)':  { m: 1 }, 
      display:'flex', flexDirection:"column",background : "#fff", width:'50vw', minWidth:'230px', margin:"auto" }}
      noValidate
      autoComplete="off"
      
      onSubmit={Formik.handleSubmit}
    >

{edit ? <Typography variant='h4' sx={{textAlign:"center"}}>Edit  subject </Typography> :
 <Typography variant='h4' sx={{textAlign:"center"}}>Add New  subject </Typography> 

}
  


        <TextField
         name='subject_name'
        label="Subject Name"
        value={Formik.values.subject_name}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

      {Formik.touched.subject_name 
      && Formik.errors.subject_name &&
       <p style={{color:"red", textTransform:"capitalize"}}> {Formik.errors.subject_name}</p>}


  <TextField
        type='string'
         name='subject_codename'
        label="Subject CodeName"
        value={Formik.values.subject_codename}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

{Formik.touched.subject_codename && Formik.errors.subject_codename &&
  <p style={{color:"red", textTransform:"capitalize"}}>{Formik.errors.subject_codename}</p>
}

 
<Button type='submit' variant='contained'>Submit</Button>

{edit && 
  <Button onClick={() => cancelEdit()} type='button' variant='outlined'>Cancel</Button>
}

 
 
  
  </Box>
  <Box component={'div'} sx={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>

    {subjects && subjects.map(x=>{
      return (
     
      <Paper key={x._id} sx={{m:2, p:2}}>
        
      <Box component={'div'}> 
         <Typography variant="h6">
        subject: {x.subject_name} [{x.subject_codename}]
       </Typography> </Box>
      
       <Box component={'div'}> 
        {/* <Button onClick={()=>handleEdit(x._id)}> */}
        <Button onClick={()=>{handleEdit(x._id, x.subject_name,x.subject_codename)}}>

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