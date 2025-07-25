import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useFormik} from 'formik'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios'
import MessageSnackBar from '../../../basicUtilityComponent/MessageSnackBar';
import { useContext, useState } from 'react';
import { loginSchema } from '../../../yupSchema/loginSchema';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles'; 


export default function Login() {
       const {login} = useContext(AuthContext);
       const navigate = useNavigate()

  const initialValues  = {    
      email: "",
      password: "",     
  }

  const Formik = useFormik({
    initialValues,
    validationSchema: loginSchema,

    onSubmit: (values)=>{
      let URL ="";
       if(role === "student"){
        URL = `http://localhost:5000/api/student/login`
       }else if(role === "teacher"){
        URL = `http://localhost:5000/api/teacher/login`

       }
       else if(role === "school"){
        URL = `http://localhost:5000/api/school/login`

       }
        axios.post(URL, {...values}).then(res=>{
         const token = res.headers.get("Authorization");
         if (token){
            localStorage.setItem("token", token)

         }
         const user = res.data.user;
          if(user){
            localStorage.setItem("user",JSON.stringify(user))
            login(user);

          }

          console.log(res);
          setMessage(res.data.message)
          setMessageType('success')
        Formik.resetForm()
        navigate(`/${role}`)

        }).catch(e=>{
          console.log(e)
           setMessage(e.response.data.message)
          setMessageType('error')
        })

   
    }


  })

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success')

  const handleMessageClose = ()=>{
     setMessage('')
  }
  
  const [role , setRole ] = useState('student')
const theme = useTheme(); 


  return (
    <>
    <Box component={'div'}  sx={{background:"url(https://cdn.pixabay.com/photo/2017/08/12/21/42/back2school-2635456_1280.png)",
      backgroundSize: "cover",
      backgroundRepeat:"no-repeat",
      height:"100%",
     minHeight:"80vh",
      paddingTop:"60px",
      paddingBottom:"60px",
    
    }}> 

  {message &&    
      <MessageSnackBar
  message={message}
  messageType={messageType}
  handleClose={handleMessageClose}
/> }

  
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

 <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label"> Role </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={role}
          label="Age"
          onChange={(e)=>{setRole (e.target.value)}}
        >
          <MenuItem value={"student"}>Student</MenuItem>
                   <MenuItem value={"teacher"}>Teacher</MenuItem>
          <MenuItem value={"school"}>School </MenuItem>


        </Select>
      </FormControl>

<Typography variant='h2' sx={{textAlign:"center"}}>Login</Typography>
  


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
 

 


       <Button type='submit'  variant='contained'>Submit</Button>
 
 
 
    </Box>

</Box>
      </>
  );
}