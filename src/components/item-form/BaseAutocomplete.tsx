import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

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
  error?: boolean;
  helperText?: string;
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
  addOne,
  error,
  helperText
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
            isOptionEqualToValue={(a, b) =>
              typeof a !== 'string' && typeof b !== 'string' && a.id === b.id
            }
            onChange={async (_e, newValue) => {
              const normalize = (s: string) => s.trim().toLocaleLowerCase();

              const toId = async (v: string | T | null): Promise<number | null> => {
                if (!v) {
                  return null;
                }
                if (typeof v === 'string') {
                  const existing = options.find(o => normalize(o.name) === normalize(v));
                  if (existing) {
                    return existing.id;
                  }
                  if (addOne) {
                    const created = await addOne(v.trim());
                    return created?.id ?? null;
                  }
                  return null;
                }
                return v.id;
              };

              if (multiple) {
                const ids = (await Promise.all(
                  (newValue as (string | T)[]).map(toId)
                )).filter((id): id is number => id !== null);
                field.onChange(ids);
              } else {
                const ids = (await Promise.all(
                  [newValue as string | T | null].map(toId)
                )).filter((id): id is number => id !== null);
                field.onChange(ids.length ? ids[0] : null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={error || !!fieldState.error}
                helperText={helperText || fieldState.error?.message}
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
