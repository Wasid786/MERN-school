import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { baseApi } from "../../../envirionment"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardMedia from "@mui/material/CardMedia";
import MessageSnackBar from "../../../basicUtilityComponent/MessageSnackBar";

export default function Dashboard (){
   const [edit, setEdit] = useState(false);
   const [school, setSchool] = useState(null);
   const [schoolName, setSchoolName] = useState(null);

   // image handling 
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

     const [message, setMessage] = useState('');
     const [messageType, setMessageType] = useState('success');
     const handleMessageClose = ()=>{
      setMessage('') 
     }


     const handleEditSubmit = ()=>{
        const fd  = new FormData();
      fd.append("school_name", schoolName)
      if(file){
         fd.append("image", file, file.name)
      }
         axios.patch(`${baseApi}/school/update`, fd).then(res=>{
          setMessage(res.data.message)
          setMessageType('success')
          cancelEdit();
         }).catch(e=>{
            setMessage(e.res.data.message)
            setMessageType('error')
            console.log('Error', e) 
         })
     }
     const cancelEdit = ()=>{
       setEdit(false)
       handleClearFile()
     }

   const fetchSchool = ()=>{
      axios.get(`${baseApi}/school/fetch-single`).then(resp=>{
         console.log(resp);
         setSchool(resp.data.school)
         setSchoolName(resp.data.school.school_name)
      }).catch(e=>{
         console.log("Error", e) 
      })

   }

   useEffect(()=>{
      fetchSchool();

   },[message])


     return (
        <>
         <h1>Dashboard</h1>
           {message &&    
               <MessageSnackBar
           message={message}
           messageType={messageType}
           handleClose={handleMessageClose}
         /> }
         {edit && <> 
              <Box
      component="form"
      sx={{ '& > :not(style)':  { m: 1 }, 
      display:'flex', flexDirection:"column",background : "#fff", width:'50vw', minWidth:'230px', margin:"auto" }}
      noValidate
      autoComplete="off"
      

>

<Typography>  Edit School Picture 
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
        label="School Name"
        value={schoolName}
        onChange={(e)=>{setSchoolName(e.target.value)}}
      />

       <Button variant="contained" onClick={handleEditSubmit}>Submit Edit </Button>
       <Button variant="outlined"  onClick={cancelEdit}>Cancel Edit </Button>

 
 
 
    </Box>

         </>}
     {school &&  
  <Box
    sx={{
      position:'relative',
      height: '500px',
      width: '100%',
      backgroundImage: `url(/images/uploaded/school/${school.school_image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Typography variant='h3' sx={{ color: 'white', textShadow: '1px 1px 2px black' }}>
      {school.school_name}
    </Typography>
    <Box component={'div'} sx={{position:'absolute', bottom:"10px", right:"10px"}}>
       <Button variant="outline" sx={{background:"#fff", borderRadius:"50%", color:"black", height:"60px"}} onClick={()=>{
         setEdit(true);
       }}>
          <EditIcon/>
       </Button>
    </Box>
  </Box>


}

        </>
     )
}