import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { mapValuesToIds } from '../other/mapValuesToIds';

type Props<FV extends FieldValues, T extends { id: number; name: string }> = {
  control: Control<FV, unknown>;
  name: Path<FV>;
  label: string;
  disabled?: boolean;
  multiple?: boolean;
  freeSolo?: boolean;
  options: T[];
  loading: boolean;
  addOne?: (name: string) => Promise<T | null>;
};

export function BaseAutocomplete<
  FV extends FieldValues,
  T extends { id: number; name: string }
>({
  control,
  name,
  label,
  disabled,
  multiple = false,
  freeSolo = false,
  options,
  loading,
  addOne
}: Props<FV, T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValue: T | T[] | null =
          multiple && Array.isArray(field.value)
            ? options.filter(o => (field.value as number[]).includes(o.id))
            : !multiple && field.value
              ? options.find(o => o.id === field.value) ?? null
              : multiple
                ? []
                : null;

        return (
          <Autocomplete<T, typeof multiple, false, typeof freeSolo>
            multiple={multiple}
            freeSolo={freeSolo}
            options={options}
            value={selectedValue}
            loading={loading}
            disabled={disabled}
            getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.name)}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={async (_e, newValue) => {
              if (multiple) {
                const ids = await mapValuesToIds(
                  newValue as (string | T)[],
                  options,
                  addOne!
                );
                field.onChange(ids);
              } else {
                const ids = await mapValuesToIds(
                  [newValue as string | T | null],
                  options,
                  addOne
                );
                field.onChange(ids.length ? ids[0] : null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress size={18} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        );
      }}
    />
  );
}
