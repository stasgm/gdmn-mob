import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@material-ui/core';

interface props {
  errorMessage: string;
  onCleanError: () => void;
}

const SnackBar = ({ errorMessage, onCleanError }: props) => {
  // SnackBar
  const [openAlert, setOpenAlert] = useState(false);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onCleanError;
    setOpenAlert(false);
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }
    setOpenAlert(true);
  }, [errorMessage]);

  return (
    <>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}!
        </Alert>
      </Snackbar>
    </>
  );
};

export default SnackBar;
