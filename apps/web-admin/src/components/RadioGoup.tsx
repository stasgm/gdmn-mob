import { Button, Box, Dialog, DialogContent, DialogContentText, Typography, DialogActions, Radio } from '@mui/material';

interface IProps {
  checked: string | undefined;
  onChange: (value: string) => void;
  isOpen: boolean;
  okLabel: string;
  onClose: () => void;
  onOk: () => void;
  onCancel: () => void;
  values: string[];
  contentText: string;
}

const RadioGroup = ({ checked, onChange, isOpen, onClose, values, onOk, okLabel, onCancel, contentText }: IProps) => {
  return (
    <Box>
      <Dialog open={isOpen} onClose={onClose}>
        <DialogContent>
          <DialogContentText color="black">{contentText}</DialogContentText>
          <Box sx={{ flexDirection: 'column' }}>
            {values.map((value) => (
              <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }} key={value}>
                <Radio checked={checked === value} onChange={() => onChange(value)} value={value} name={value} />
                <Typography color="textPrimary" variant="subtitle1">
                  {value || ''}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onOk} color="primary" variant="contained">
            {okLabel}
          </Button>
          <Button onClick={onCancel} color="secondary" variant="contained">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RadioGroup;
