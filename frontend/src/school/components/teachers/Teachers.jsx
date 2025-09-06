
import { useEffect, useRef } from "react";
import { useState } from "react";
import { teacherEditSchema, teachersSchema } from "../../../yupSchema/teachersSchema";
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
import EditIcon  from "@mui/icons-material/Edit"
import DeleteIcon  from "@mui/icons-material/Delete"
import { useTheme } from "@emotion/react";


export default function Teachers() {
    // eslint-disable-next-line no-unused-vars
    const[classes, setClasses] = useState([])

    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [edit , setEdit ] = useState(false);
    const [editId, setEditId] = useState(null)


 const handleEdit = (id)=>{
  setEdit(true);
  setEditId(id);
  const fileteredTeacher  = teachers.filter(x =>x._id === id)
  formik.setFieldValue('email',fileteredTeacher[0].email )
  formik.setFieldValue('name',fileteredTeacher[0].name )
  formik.setFieldValue('age',fileteredTeacher[0].age )
  formik.setFieldValue('gender',fileteredTeacher[0].gender )
  formik.setFieldValue('qualification',fileteredTeacher[0].qualification )
  formik.setFieldValue('phone',fileteredTeacher[0].phone )


 }
 const cancelEdit = ()=>{

    setEdit(false);
    setEditId(null)
   formik.resetForm()

 }
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
      age: '',
      gender:"",
      phone:"",
      qualification:"",
      password: "",
      confirm_password: "",
      
  }

const formik = useFormik({
  initialValues,
  validationSchema: edit ? teacherEditSchema : teachersSchema,

onSubmit: async (values) => {
  if(!edit){
    if (file) {
    const fd = new FormData();
    fd.append("image", file, file.name);
    fd.append("name", values.name);
    fd.append("email", values.email);
    fd.append("age", values.age);
    fd.append("gender", values.gender);
    fd.append("phone", values.phone);
    fd.append("qualification", values.qualification);
    fd.append("password", values.password);

    try {
      const res = await axios.post("http://localhost:5000/api/teacher/register", fd);
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
  }else{
     const fd = new FormData()
      fd.append("name", values.name);
    fd.append("email", values.email);
    fd.append("age", values.age);
    fd.append("gender", values.gender);
    fd.append("phone", values.phone);

    fd.append("qualification", values.qualification);
    fd.append("password", values.password);
    if(file){
        fd.append("image", file, file.name);
    }
    try {
      if(values.password){
        fd.append("password", values.password)
      }
      const res = await axios.patch(`http://localhost:5000/api/teacher/update/${editId}`, fd);
      setMessage(res.data.message);
      setMessageType("success");
      formik.resetForm();
      handleClearFile();
    } catch (e) {
      setMessage(e?.response?.data?.message || "Error occurred");
      setMessageType("error");
    }
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
const [params, setParams] = useState({})



   const handleSearch = (e)=>{
    setParams((prevParams)=>({
      ...prevParams,
      search: e.target.value || undefined
    }))
   }
   const [teachers, setTeachers]  = useState([])



  const fetchTeachers = ()=>{
      axios.get(`${baseApi}/teacher/fetch-query`,{params}).then(res=>{
         setTeachers(res.data.teachers)
   
         
      }).catch(e=>{
         console.log(e, " Error while Fetching Data")
      })
  }

  const handleDelete = (id)=>{
    if(confirm("Are you sure you want to delete?")){
      axios.delete(`${baseApi}/teacher/delete/${id}`).then((res)=>{
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
  
  },[])

  useEffect(()=>{
      fetchTeachers()
  }, [message, params])





const  theme = useTheme()

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
{edit ? <Typography variant='h2' sx={{textAlign:"center"}}>Edit Teacher</Typography> : 
<Typography variant='h2' sx={{textAlign:"center"}}>Register Teacher</Typography>}
  
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
  onSubmit={formik.handleSubmit}
>

<Typography>  Add Teacher Picture 
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
         name='phone'
        label="Phone Number"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched.phone 
      && formik.errors.phone &&
       <p style={{color:"red", textTransform:"capitalize"}}> {formik.errors.phone}</p>}
   


         <TextField
         name='qualification'
        label="Qualification"
        value={formik.values.qualification}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched.qualification 
      && formik.errors.qualification &&
       <p style={{color:"red", textTransform:"capitalize"}}> {formik.errors.qualification}</p>}


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

 {edit && 
  <Button onClick={() => cancelEdit()} type='button' variant='outlined'>Cancel</Button>
}

 
 
    </Box>

    <Box component={'div'} sx={{display:"flex", flexDirection:"row", justifyContent:"center", marginTop:"40px"}}>
  <TextField

        label="Search"
        value={params.search || ''}
        onChange={(e)=>{
          handleSearch(e)
        }}
        />


    </Box>

   <Box component={'div'} 
   sx={{display:"flex", flexWrap: "wrap", gap: "20px", justifyContent:"center", marginTop:"40px"}}>
         
  {teachers && teachers.map(teacher => {
     return (
    <Card key={teacher._id} sx={{ maxWidth: 345, marginRight:'10px' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
         image={teacher.teacher_image}
          alt={teacher.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          <span style={{fontWeight:700}}> Name:  </span>{teacher.name}
          </Typography>
         

                <Typography gutterBottom variant="h5" component="div">
        <span style={{fontWeight:700}}> Email:  </span>    {teacher.email}
          </Typography>
            
                 <Typography gutterBottom variant="h5" component="div">
           <span style={{fontWeight:700}}> Age:  </span> {teacher.age}
          </Typography>     
            <Typography gutterBottom variant="h5" component="div">
          <span style={{fontWeight:700}}> Gender:  </span>  {teacher.gender}
          </Typography>     
           
                 <Typography gutterBottom variant="h5" component="div">
           <span style={{fontWeight:700}}>Qualification:  </span> {teacher.qualification}
          </Typography>
    
         
        </CardContent>
        
      </CardActionArea>
       <Button  
            color="error"
            onClick={() => handleDelete(teacher._id)}
          >
            <DeleteIcon/>
          </Button >
               <Button  onClick ={()=> {handleEdit(teacher._id)}}>
            <EditIcon/>
          </Button>
    </Card>
  )})}
</Box>

</Box>
      </>
  );
}