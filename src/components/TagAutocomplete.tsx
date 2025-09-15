import React from 'react';
import {
  Autocomplete,
  CircularProgress,
  TextField
} from '@mui/material';
import {
  Control,
  Controller,
  FieldValues,
  Path,
} from 'react-hook-form';
import { ApiService, TagRow } from '../services/api-service';

type Props<FormValues extends FieldValues> = {
  control: Control<FormValues>;
  name: Path<FormValues>;
  label?: string;
  disabled?: boolean;
};

export function TagAutocomplete<FormValues extends FieldValues>({
  control,
  name,
  label = 'Tags',
  disabled,
}: Props<FormValues>) {
  const [options, setOptions] = React.useState<TagRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    ApiService.getTags()
      .then((list) => { if (mounted) setOptions(list); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected: TagRow[] =
          Array.isArray(field.value)
            ? options.filter(o => (field.value as number[]).includes(o.id))
            : [];

        return (
          <Autocomplete<TagRow, true, false, true>
            multiple
            freeSolo
            options={options}
            value={selected}
            loading={loading}
            disabled={disabled}
            getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.name)}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={async (_e, newValue) => {
              const ids: number[] = [];

              for (const v of newValue) {
                if (typeof v === 'string') {
                  const name = v.trim();
                  if (!name) continue;

                  const exists = options.find(
                    o => o.name.toLowerCase() === name.toLowerCase()
                  );
                  if (exists) {
                    ids.push(exists.id);
                    continue;
                  }

                  try {
                    const created = await ApiService.createTag({ name });
                    if (created) {
                      setOptions(prev => [created, ...prev]);
                      ids.push(created.id);
                    }
                  } catch (err) {
                    console.error('Create tag failed', err);
                  }
                } else {
                  ids.push(v.id);
                }
              }

              field.onChange(ids);
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
