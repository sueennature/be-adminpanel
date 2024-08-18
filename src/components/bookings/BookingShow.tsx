import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

// Define the type for the props
interface BookingShowProps {
  handleClose: () => void;
  open: boolean;
  data: any;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiDialogContent-root': {
      padding: theme.spacing(1),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(0.5),
    },
  },
}));

export default function BookingShow({ handleClose, open, data }: BookingShowProps) {
  const [viewData, setViewData] = useState<any>({});

  useEffect(() => {
    setViewData(data);
  }, [data]);

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Booking Details
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">Guest Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>Name: {viewData.guest_info?.first_name} {viewData.guest_info?.last_name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Email: {viewData.guest_info?.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Telephone: {viewData.guest_info?.telephone}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Address: {viewData.guest_info?.address}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Nationality: {viewData.guest_info?.nationality}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>ID Type: {viewData.guest_info?.identification_type}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>ID Number: {viewData.guest_info?.identification_no}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Date of Birth: {new Date(viewData.guest_info?.dob).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 2 }}>Agent Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>Name: {viewData.agent_info?.first_name} {viewData.agent_info?.last_name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Email: {viewData.agent_info?.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Telephone: {viewData.agent_info?.telephone}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Address: {viewData.agent_info?.address}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Nationality: {viewData.agent_info?.nationality}</Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 2 }}>Booking Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>Total Amount: {viewData.total_amount}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Total Taxes: {viewData.total_taxes}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Total Rooms Charge: {viewData.total_rooms_charge}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Total Activities Charge: {viewData.total_activities_charge}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Total Discount Amount: {viewData.total_discount_amount}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Total Additional Services Amount: {viewData.total_additional_services_amount}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Balance Amount: {viewData.balance_amount}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Booking Note: {viewData.booking_note}</Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 2 }}>Activities</Typography>
        <Grid container spacing={2}>
          {viewData.activities && viewData.activities.map((activity: any, index: number) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography>{activity.activity_name} - {activity.activity_cost}</Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
