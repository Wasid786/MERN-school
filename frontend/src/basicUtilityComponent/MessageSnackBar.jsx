
import Snackbar from '@mui/material/Snackbar';

import Alert from '@mui/material/Alert';

export default function MessageSnackBar({ message, messageType, handleClose })
{

  return (
    <div>
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