import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface props {
  visible?: boolean;
  errorMessage: string;
  onClearError: () => void;
}

const SnackBar = ({ visible = false, errorMessage, onClearError }: props) => {
  const handleClose = (_event?: Event | React.SyntheticEvent<any, Event>) => {
    onClearError();
  };

  return (
    <>
      <Snackbar open={visible} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}!
        </Alert>
      </Snackbar>
    </>
  );
};

export default SnackBar;
