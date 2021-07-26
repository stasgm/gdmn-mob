import { TextField, createFilterOptions, Autocomplete } from '@material-ui/core';

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
}: IProps) => {
  return (
    <Autocomplete
      {...field}
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={filterOptions}
      onChange={(_, newValue) => setFieldValue(field.name, newValue)}
      onBlur={() => setTouched({ [field.name]: true })}
      renderInput={(params) => <TextField label={label} required {...params} variant="outlined" error={error} />}
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
