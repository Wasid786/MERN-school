import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

export default function MessageSnackBar({message,messageType, handleClose}) {
  // const [open, setOpen] = React.useState(false);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  // const handleClose = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }

  //   setOpen(false);
  // };

  // eslint-disable-next-line no-unused-vars
  const action = (
    <React.Fragment>
      {/* <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      {messageType}
      <Snackbar
        open={true}
        autoHideDuration={6000}
        onClose={handleClose}
        
       
        
      >
        <Alert
        onClose={handleClose}
         severity={messageType}
        variant= "filled"
       sx={{width:'100%'}}
        >
 {message}
        </Alert>
       
        
         </Snackbar>
    </div>
  );
}