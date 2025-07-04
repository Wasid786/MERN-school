
import { useEffect, useRef } from "react";
import { useState } from "react";
import { studentsSchema } from "../../../yupSchema/studentsSchema";
import axios from "axios";
import Box from "@mui/material/Box";
import MessageSnackBar from "../../../basicUtilityComponent/MessageSnackBar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { baseApi } from "../../../envirionment"
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import {useFormik} from 'formik'


export default function Students() {
    // eslint-disable-next-line no-unused-vars
    const[classes, setClasses] = useState([])

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

      

   const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success')


  const initialValues  = { 
       name: "",
      email: "",
      student_class:"",
      age: '',
      gender:"",
      guardian:"",
      guardian_phone:"",
      password: "",
      confirm_password: "",
      
  }

const formik = useFormik({
  initialValues,
  validationSchema: studentsSchema,

onSubmit: async (values) => {
  if (file) {
    const fd = new FormData();
    fd.append("image", file);
    fd.append("name", values.name);
    fd.append("email", values.email);
    fd.append("student_class", values.student_class);
    fd.append("age", values.age);
    fd.append("gender", values.gender);
    fd.append("guardian", values.guardian);
    fd.append("guardian_phone", values.guardian_phone);
    fd.append("password", values.password);

    try {
      const res = await axios.post("http://localhost:5000/api/student/register", fd);
      setMessage(res.data.message);
      setMessageType("success");
      formik.resetForm();
      handleClearFile();
    } catch (e) {
      setMessage(e?.response?.data?.message || "Error occurred");
      setMessageType("error");
    }
  } else {
    setMessage("Please Select Image");
    setMessageType("error");
  }
}

});







  



  const handleMessageClose = ()=>{
     setMessage('')
  }
 
  const fetchClasses = ()=>{
      axios.get(`${baseApi}/class/all`).then(res=>{
         setClasses(res.data.data);
      }).catch(e=>{
         console.log(e, "Error while Fetching Class Data")
      })
  }


   const handleClass = (e)=>{
    setParams((prevParams)=>({
      ...prevParams,
      student_class: e.target.value || undefined
    }))
   }

   const handleSearch = (e)=>{
    setParams((prevParams)=>({
      ...prevParams,
      search: e.target.value || undefined
    }))
   }
   const [students, setStudents]  = useState([])

const [params, setParams] = useState({})

  const fetchStudents = ()=>{
      axios.get(`${baseApi}/student/fetch-query/`,{params}).then(res=>{
              console.log("Response Student", res)
         setStudents(res.data.name)
   
         
      }).catch(e=>{
         console.log(e.message, "Error while Fetching Data")
      })
  }

  const handleDelete = (id)=>{
    if(confirm("Are you sure you want to delete?")){
      axios.delete(`${baseApi}/student/delete/${id}`).then((res)=>{
        setMessage(res.data.message)
        setMessageType("success");
      }).catch((e)=>{
        setMessage(e.response.data.message)
        setMessageType("error")
      })
    }
  }

  useEffect(()=>{
      fetchClasses()
      fetchStudents()
  }, [message, params])

  return (
    <>
    <Box component={'div'}  
    sx={{
      // background:"url(https://cdn.pixabay.com/photo/2017/08/12/21/42/back2 -2635456_1280.png)",
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
<Typography variant='h2' sx={{textAlign:"center"}}>Register Student</Typography>
  
    <Box
      component="form"
      sx={{ '& > :not(style)':  { m: 1 }, 
      display:'flex', flexDirection:"column",background : "#fff", width:'50vw', minWidth:'230px', margin:"auto" }}
      noValidate
      autoComplete="off"
      
      onSubmit={formik.handleSubmit}
    >

<Typography>  Add Student Picture 
</Typography>

     <TextField
            type='file'
         name='image'
         inputRef={fileInputRef}
        onChange={(event)=>addImage(event)}
      />


      {imageUrl && <Box>  

        <CardMedia component={'img'} height={"240px"} image={imageUrl}/>
      </Box>
        
        }

  

      <TextField
         name='name'
        label=" Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched.name 
      && formik.errors.name &&
       <p style={{color:"red", textTransform:"capitalize"}}> {formik.errors.name}</p>}

        <TextField
         name='email'
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched.email 
      && formik.errors.email &&
      <p style={{color:"red", textTransform:"capitalize"}}> {formik.errors.email}</p>}



<FormControl fullWidth sx={{ mb: 2 }} error={Boolean(formik.touched.student_class && formik.errors.student_class)}>
  <InputLabel id="class-label">Select Class</InputLabel>
  <Select
    labelId="class-label"
    name="student_class"
    label="Select  Class"
    value={formik.values.student_class}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  >
     {classes && classes.map(x=>{
      return (

          <MenuItem key={x._id} value={x._id}> {x.class_text}  ({x.class_num})</MenuItem>
      )

   })}
  </Select>

  {formik.touched.student_class && formik.errors.student_class && (
    <p style={{ color: "red", textTransform: "capitalize", marginTop: "4px" }}>
      {formik.errors.student_class}
    </p>
  )}
</FormControl>



         <TextField
         name='age'
        label="Age"
        value={formik.values.age}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched.age 
      && formik.errors.age &&
       <p style={{color:"red", textTransform:"capitalize"}}> {formik.errors.age}</p>}


<FormControl fullWidth sx={{ mb: 2 }} error={Boolean(formik.touched.gender && formik.errors.gender)}>
  <InputLabel id="gender-label">Gender</InputLabel>
  <Select
    labelId="gender-label"
    name="gender"
    label="Gender"
    value={formik.values.gender}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  >
    <MenuItem value="">
    </MenuItem>
    <MenuItem value="male">Male</MenuItem>
    <MenuItem value="female">Female</MenuItem>
    <MenuItem value="other">Other</MenuItem>
  </Select>
  {formik.touched.gender && formik.errors.gender && (
    <p style={{ color: "red", textTransform: "capitalize", marginTop: "4px" }}>
      {formik.errors.gender}
    </p>
  )}
</FormControl>




         <TextField
         name='guardian'
        label="Guardian"
        value={formik.values.guardian}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched.guardian 
      && formik.errors.guardian &&
       <p style={{color:"red", textTransform:"capitalize"}}> {formik.errors.guardian}</p>}


         <TextField
         name='guardian_phone'
        label="Guardian Phone"
        value={formik.values.guardian_phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched.guardian_phone 
      && formik.errors.guardian_phone &&
       <p style={{color:"red", textTransform:"capitalize"}}> {formik.errors.guardian_phone}</p>}


  <TextField
        type='password'
         name='password'
        label="Password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched.password 
      && formik.errors.password &&
       <p style={{color:"red", textTransform:"capitalize"}}> {formik.errors.password}</p>}
 

   <TextField
           type='password'
         name='confirm_password'
        label="Confirm Password"
        value={formik.values.confirm_password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched.confirm_password 
      && formik.errors.confirm_password &&
       <p style={{color:"red", textTransform:"capitalize"}}> {formik.errors.confirm_password}</p>}


<Button 
  type='submit' 
  variant='contained'
>
  Submit
</Button>

 
 
 
    </Box>

    <Box component={'div'} sx={{display:"flex", flexDirection:"row", justifyContent:"center", marginTop:"40px"}}>
  <TextField

        label="Search"
        onChange={(e)=>{
          handleSearch(e)
        }}
       
        onBlur={formik.handleBlur}
      />


  <FormControl sx={{ mb: 2, width:"230px" }}>
  <InputLabel>Student Class</InputLabel>
  <Select 
    label="Student Class"  
    onChange={(e)=>{handleClass(e)}}
    value={params.student_class || ''}
  >
    <MenuItem value="">All Classes</MenuItem>
    {classes.map(cls => (
      <MenuItem key={cls._id} value={cls._id}>
        {cls.class_text} ({cls.class_num})
      </MenuItem>
    ))}
  </Select>
</FormControl>
    </Box>

   <Box component={'div'} sx={{display:"flex", flexWrap: "wrap", gap: "20px", justifyContent:"center", marginTop:"40px"}}>
  {students && students.map(student => (
    <Card key={student._id} sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={student.imageUrl || "/static/images/default-student.jpg"}
          alt={student.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {student.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Class: {student.student_class?.class_text || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Age: {student.age}
          </Typography>
          <Button 
            color="error"
            onClick={() => handleDelete(student._id)}
          >
            Delete
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  ))}
</Box>

</Box>
      </>
  );
}