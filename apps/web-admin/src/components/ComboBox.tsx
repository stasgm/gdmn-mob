import { TextField, createFilterOptions, Autocomplete } from '@mui/material';

import { INamedEntity } from '@lib/types';

interface IProps {
  field: any;
  label: string;
  options: any[];
  setFieldValue: any;
  setTouched: any;
  error?: any;
  getOptionLabel?: (option: any) => string;
  filterOptions?: any;
  isOptionEqualToValue?: any;
  required?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | undefined;
}

const ComboBox = ({
  field,
  label,
  options,
  setFieldValue,
  setTouched,
  error,
  getOptionLabel = getOptionLabelDefault,
  filterOptions = filterOptionsDefault,
  isOptionEqualToValue = isOptionEqualToValueDefault,
  required = false,
  disabled = false,
  size = 'medium',
}: IProps) => {
  return (
    <Autocomplete
      {...field}
      disabled={disabled}
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={filterOptions}
      onChange={(_, newValue) => setFieldValue(field.name, newValue)}
      onBlur={() => setTouched({ [field.name]: true })}
      renderInput={(params) => (
        <TextField label={label} required={required} {...params} variant="outlined" error={error} size={size} />
      )}
    />
  );
};

const filterOptionsDefault = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: INamedEntity) => option.name,
});

const getOptionLabelDefault = (option: INamedEntity) => option.name;

const isOptionEqualToValueDefault = (option: INamedEntity, val: INamedEntity) => option.id === val.id;

export default ComboBox;
