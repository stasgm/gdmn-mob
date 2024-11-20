import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

interface IProps {
  value?: string;
  isOpen: boolean;
  okLabel: string;
  onClose: () => void;
  onOk: (value: string) => void;
}

const SearchTextField = ({ value, isOpen, okLabel, onClose, onOk }: IProps) => {
  const [text, setText] = useState('');

  const handleClose = useCallback(() => {
    setText('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    value && setText(value);
  }, [isOpen, value]);

  return (
    <Box>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogContent>
          <DialogContentText color="black">Будем искать по файлам</DialogContentText>
          <TextField
            label=""
            name="searchByFile"
            value={text}
            onChange={(event) => setText(event.target.value)}
            fullWidth
            minRows={5}
            maxRows={15}
            multiline={true}
            placeholder="Искать..."
            variant="outlined"
            onKeyPress={(event) => event.key === 'Enter' && onOk(text)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onOk(text)} color="primary" variant="contained">
            {okLabel}
          </Button>
          <Button onClick={() => setText('')} color="secondary" variant="contained">
            Очистить
          </Button>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchTextField;
