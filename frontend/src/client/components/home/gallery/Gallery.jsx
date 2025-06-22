import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
export default function Gallery() {

      const [open, setOpen] = useState(false);
      const [selectedSchool, setSelectedSchool] =  useState(null)
      const [schools, setSchools] = useState([]);

      const handleOpen =(school)=>{
        setOpen(true)
        setSelectedSchool(school)
      }
      const handleClose =()=>{
        setOpen(false)
        setSelectedSchool(null)
      }

//     const style = {
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   width: "100%",
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };


useEffect(()=>{

      axios.get(`http://localhost:5000/api/school/all`).then(res=>{
          console.log(res);
          setSchools(res.data.schools)
        //   setMessage(res.data.message)
        //   setMessageType('success')
        // Formik.resetForm()

        }).catch(e=>{
          console.log(e)
        //    setMessage(e.response.data.message)
        //   setMessageType('error')
        })
},[])

  return (
    <Box> 
        <Typography variant='h4' sx={{ textAlign:'center', marginTop:"40px", marginBottom:"20px" }}>
            Registered School 
        </Typography>
    <ImageList sx={{ width: '100%', height: "auto" }}>
      {schools.map((school) => (
        <ImageListItem key={school.school_image}>
          <img
            srcSet={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format`}
            alt={school.school_name}
            loading="lazy"
            onClick={()=>{handleOpen(school)}}
          />
          <ImageListItemBar
            title={school.school_name}
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>





  
      <Modal
        open={open && selectedSchool}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <Box component={'div'} 
        sx={{position:"absolute", top: "50%", left:"50%",
         transform:"translate(-50%, -50%)",
         padding:"10px",
         border:"none",
         outline:"none",
         background:"#fff"}} >

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
           {selectedSchool && selectedSchool.school_name}
          </Typography>

            <img
            src={selectedSchool && `./images/uploaded/school/${selectedSchool.school_image}`}
            style={{maxHeight:"80vh"}}
            alt={"alt"}
            loading="lazy"
          
          />
        </Box>
      </Modal>
  );
  )
</Box>
  );
}
