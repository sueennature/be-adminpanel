import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface BookingShowProps {
  handleDelete: (id: any) => void;
  handleClose: () => void;
  open: boolean;
  data: any;
}

export default function ConfirmAlertDialog({handleClose, handleDelete, open, data} : BookingShowProps) {

  return (
    <React.Fragment>
    
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this item?"}
        </DialogTitle>
    
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={()=>handleDelete(data?.id)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
