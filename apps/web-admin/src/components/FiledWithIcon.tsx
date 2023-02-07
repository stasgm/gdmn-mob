import { Grid, Button, Tooltip, Box } from '@material-ui/core';
import { PlusSquare as AddIcon } from 'react-feather';

import { Field } from 'formik';

import ComboBox from './ComboBox';

interface IProps {
  field?: any;
  label: string;
  type: string;
  name: string;
  options: any[];
  setFieldValue: any;
  setTouched: any;
  error?: any;
  getOptionLabel?: (option: any) => string;
  filterOptions?: any;
  isOptionEqualToValue?: any;
  required?: boolean;
  onButtonClick?: () => void;
  disabled?: boolean;
  toolipTitle: string;
}

const FieldWithIcon = ({
  field,
  label,
  name,
  type,
  options,
  setFieldValue,
  setTouched,
  error,
  toolipTitle,
  onButtonClick,
  required = false,
  disabled = false,
}: IProps) => {
  return (
    <Grid container>
      <Box style={{ flexGrow: 1 }}>
        <Field
          {...field}
          component={ComboBox}
          name={name}
          label={label}
          type={type}
          options={options}
          setFieldValue={setFieldValue}
          setTouched={setTouched}
          error={error}
          disabled={disabled}
          fullWidth
        />
      </Box>
      <Tooltip title={toolipTitle}>
        <Button color="primary" disabled={disabled} onClick={onButtonClick} variant="outlined" sx={{ height: 55 }}>
          <AddIcon />
        </Button>
      </Tooltip>
    </Grid>
  );
};

export default FieldWithIcon;
