import { Box, Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface IProps {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  questionText: string;
}

const ConfirmDialog = ({ open, handleClose, handleDelete, questionText }: IProps) => {
  return (
    <Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText color="black">{questionText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="primary" variant="contained">
            Удалить
          </Button>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfirmDialog;
