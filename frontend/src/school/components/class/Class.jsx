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


export default function Class (){
    const [classes, setClasses] = useState([])
    const [edit, setEdit] = useState(false)
    const [editId, setEditId] = useState(null)
//  const [editingClass, setEditingClass] = useState(null)


      const [message, setMessage] = useState('');
      const [messageType, setMessageType] = useState('success')
    
      const handleMessageClose = ()=>{
         setMessage('')
      }
    

    
    
    const handleEdit = (id, class_text, class_num) => {
        console.log("handle edit ", id)
        setEdit(true);
         setEditId(id);
        Formik.setFieldValue("class_text",class_text)
        Formik.setFieldValue("class_num",class_num)

        // const classToEdit = classes.find(c => c._id === id)
        // if (classToEdit) {
        //     Formik.setValues({
        //         class_text: classToEdit.class_text,
        //         class_num: classToEdit.class_num
        //     })
        //     setEditingClass(id)
        //     setEdit(true)
        // }
    }

   const cancelEdit = () => {
        // setEdit(false)
        // setEditingClass(null)
        // Formik.resetForm()
             setEdit(false);
             setEditId(null)
        Formik.setFieldValue("class_text","")
        Formik.setFieldValue("class_num","")
    }

           const handleDelete = (id)=>{
        console.log("handle Delete ")
        axios.delete(`${baseApi}/class/delete/${id}`).then(res=>{
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
      initialValues: {class_text: "", class_num:""},
      validationSchema: ClassSchema,
      onSubmit:(values)=>{
         console.log(values)
          
         if(edit){

                  axios.patch(`${baseApi}/class/update/${editId}`, {...values}).then(res=>{
          console.log("Class add Response", res) 
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


     return (
        <>
               {message &&    
                   <MessageSnackBar
               message={message}
               messageType={messageType}
               handleClose={handleMessageClose}
             /> }

             <h1>Class </h1>


    <Box
      component="form"
      sx={{ '& > :not(style)':  { m: 1 }, 
      display:'flex', flexDirection:"column",background : "#fff", width:'50vw', minWidth:'230px', margin:"auto" }}
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
        {/* <Button onClick={()=>handleEdit(x._id)}> */}
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