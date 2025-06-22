import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useFormik} from 'formik'
import { registerSchema } from '../../../yupSchema/registerSchema';
import Button from '@mui/material/Button';
import { useRef, useState } from 'react';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import axios from 'axios'
import MessageSnackBar from '../../../basicUtilityComponent/MessageSnackBar';

export default function Register() {
    // eslint-disable-next-line no-unused-vars
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);


  const addImage = (event)=>{
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file))
    setFile(file)

    
  }
  /// reseting image 
  const fileInputRef = useRef(null);
  const handleClearFile = ()=>{
    if (fileInputRef.current){
        fileInputRef.current.value = '';
    }
    setFile(null)
    setImageUrl(null)
  }

  const initialValues  = { 
       school_name: "",
      email: "",
      owner_name: "",
      password: "",
      confirm_password: "",
      
  }
  const Formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values)=>{
        console.log("Register Submit Values: ",values)
        
        if(file){
                  const fd = new FormData();
        fd.append("image",file, file.name);
        fd.append("school_name", values.school_name);
        fd.append("email", values.email);
        fd.append("ownner_name", values.owner_name);
        fd.append("password", values.password);


    

        axios.post(`http://localhost:5000/api/school/register`, fd).then(res=>{
          console.log(res);
          setMessage(res.data.message)
          setMessageType('success')
        Formik.resetForm()
        handleClearFile()
        }).catch(e=>{
          console.log(e)
           setMessage(e.response.data.message)
          setMessageType('error')
        })

        }else{
           setMessage("Please Select Image ")
          setMessageType('error')
        }
    }


  })

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success')

  const handleMessageClose = ()=>{
     setMessage('')
  }


  return (
    <>
    <Box component={'div'}  sx={{background:"url(https://cdn.pixabay.com/photo/2017/08/12/21/42/back2school-2635456_1280.png)",
      backgroundSize: "cover",
      backgroundRepeat:"no-repeat",
      height:"100%",
      paddingTop:"60px",
      paddingBottom:"60px"
    }}> 


  {message &&    
      <MessageSnackBar
  message={message}
  messageType={messageType}
  handleClose={handleMessageClose}
/> }
<Typography variant='h2' sx={{textAlign:"center"}}>Register</Typography>
  
    <Box
      component="form"
      sx={{ '& > :not(style)':  { m: 1 }, 
      display:'flex', flexDirection:"column",background : "#fff", width:'50vw', minWidth:'230px', margin:"auto" }}
      noValidate
      autoComplete="off"
      
      onSubmit={Formik.handleSubmit}
    >

<Typography>  Add School Picture 
</Typography>

     <TextField
            type='file'
         name='file'
         inputRef={fileInputRef}
        // value={Formik.values.}
        onChange={(event)=>addImage(event)}
      />


      {imageUrl && <Box>  

        <CardMedia component={'img'} height={"240px"} image={imageUrl}/>
      </Box>
        
        }

  

      <TextField
         name='school_name'
        label="School Name"
        value={Formik.values.school_name}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

      {Formik.touched.school_name 
      && Formik.errors.school_name &&
       <p style={{color:"red", textTransform:"capitalize"}}> {Formik.errors.school_name}</p>}

        <TextField
         name='email'
        label="Email"
        value={Formik.values.email}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

      {Formik.touched.email 
      && Formik.errors.email &&
       <p style={{color:"red", textTransform:"capitalize"}}> {Formik.errors.email}</p>}
  <TextField
         name='owner_name'
        label="Owner Name"
        value={Formik.values.owner_name}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

      {Formik.touched.owner_name 
      && Formik.errors.owner_name &&
       <p style={{color:"red", textTransform:"capitalize"}}> {Formik.errors.owner_name}</p>}
  <TextField
        type='password'
         name='password'
        label="Password"
        value={Formik.values.password}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

      {Formik.touched.password 
      && Formik.errors.password &&
       <p style={{color:"red", textTransform:"capitalize"}}> {Formik.errors.password}</p>}
 

   <TextField
           type='password'
         name='confirm_password'
        label="Confirm Password"
        value={Formik.values.confirm_password}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
      />

      {Formik.touched.confirm_password 
      && Formik.errors.confirm_password &&
       <p style={{color:"red", textTransform:"capitalize"}}> {Formik.errors.confirm_password}</p>}


       <Button type='submit'  variant='contained'>Submit</Button>
 
 
 
    </Box>

</Box>
      </>
  );
}