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

const MultipleAutocomplete = ({
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
      multiple
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      // defaultValue={[top100Films[13]]}
      filterOptions={filterOptions}
      onChange={(_, newValue) => setFieldValue(field.name, newValue)}
      onBlur={() => setTouched({ [field.name]: true })}
      renderInput={(params) => <TextField label={label} required {...params} variant="outlined" error={error} />}
    />
    // <Autocomplete
    //     multiple
    //     id="tags-outlined"
    //     options={top100Films}
    //     getOptionLabel={(option) => option.title}
    //     defaultValue={[top100Films[13]]}
    //     filterSelectedOptions
    //     renderInput={(params) => (
    //       <TextField
    //         {...params}
    //         label="filterSelectedOptions"
    //         placeholder="Favorites"
    //       />
    //     )}
    //   />
  );
};

const filterOptionsDefault = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: INamedEntity) => option.name,
});

const getOptionLabelDefault = (option: INamedEntity) => option.name;

const isOptionEqualToValueDefault = (option: INamedEntity, val: INamedEntity) => option.id === val.id;

export default MultipleAutocomplete;
