import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseApi } from '../../../../envirionment';

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schools, setSchools] = useState([]);

  const handleOpen = (school) => {
    setOpen(true);
    setSelectedSchool(school);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedSchool(null);
  };

  const fetchAllSchool = async () => {
    try {
      const response = await axios.get(`${baseApi}/school/all`);
      setSchools(response.data.schools);
      console.log(response.data.schools);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAllSchool();
  }, []);

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}
      >
        Registered School
      </Typography>

      <ImageList sx={{ width: '100%', height: 'auto' }}>
        {schools.map((school) => (
          <ImageListItem key={school._id}>
            <img
              srcSet={`${school.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${school.school_image}?w=248&fit=crop&auto=format`}
              alt={school.school_name}
              loading="lazy"
              onClick={() => handleOpen(school)}
              style={{ cursor: 'pointer' }}
            />
            <ImageListItemBar title={school.school_name} position="below" />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal
        open={open && selectedSchool}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component={'div'}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '10px',
            border: 'none',
            outline: 'none',
            background: '#fff',
          }}
        >
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {selectedSchool && selectedSchool.school_name}
          </Typography>

          <img
            src={selectedSchool?.school_image}   // ✅ use Cloudinary URL directly
            style={{ maxHeight: '80vh', maxWidth: '90vw' }}
            alt={selectedSchool?.school_name}
            loading="lazy"
          />
        </Box>
      </Modal>
    </Box>
  );
}
