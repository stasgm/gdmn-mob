import { Grid, Button, Tooltip } from '@material-ui/core';
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
      <Grid item xs={10} sm={10}>
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
        />
      </Grid>
      <Grid item xs={2} sm={2}>
        <Tooltip title={toolipTitle}>
          <Button
            color="primary"
            disabled={disabled}
            onClick={onButtonClick}
            variant="outlined"
            sx={{ height: 55 }}
            fullWidth
          >
            <AddIcon />
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default FieldWithIcon;
