import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@material-ui/core';

interface props {
  visible?: boolean;
  errorMessage: string;
  onClearError: () => void;
}

const SnackBar = ({ visible = false, errorMessage, onClearError }: props) => {
  // const [openAlert, setOpenAlert] = useState(visible);

  const handleClose = (_event?: React.SyntheticEvent) => {
    // , reason?: string
    // if (reason === 'clickaway') {
    //   return;
    // }
    onClearError();
    // setOpenAlert(false);
  };

  // useEffect(() => {
  //   if (!errorMessage) {
  //     return;
  //   }
  //   setOpenAlert(true);
  // }, [errorMessage]);

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
