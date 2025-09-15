import React from 'react';
import { Autocomplete, CircularProgress, TextField, createFilterOptions } from '@mui/material';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { ContainerRow, ContainerApi } from '../services/containers';

type AddOption = {
  __add: true;
  inputValue: string;
  name: string;
};

type Option = ContainerRow | AddOption;

function isAddOption(o: Option): o is AddOption {
  return (o as AddOption).__add === true;
}

const filter = createFilterOptions<Option>();

type Props<FV extends FieldValues> = {
  control: Control<FV>;
  name: Path<FV>;
  label?: string;
  disabled?: boolean;
};

export function ContainerAutocomplete<FV extends FieldValues>({
  control,
  name,
  label = 'Container',
  disabled,
}: Props<FV>) {
  const [options, setOptions] = React.useState<ContainerRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    ContainerApi.getContainers()
      .then((list) => {
        if (mounted) setOptions(list);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: 'Container is required' }}
      render={({ field, fieldState }) => {
        const currentId = Number(field.value ?? 0);
        const selected: ContainerRow | null =
          options.find((o) => o.id === currentId) ?? null;

        return (
          <Autocomplete<Option, false, false, false>
            value={selected ?? null}
            onChange={async (_e, newValue) => {
              if (!newValue) {
                field.onChange(null);
                return;
              }

              if (!isAddOption(newValue)) {
                field.onChange(newValue.id);
                return;
              }

              const toCreate = newValue.inputValue.trim();
              if (!toCreate) return;

              try {
                const created = await ContainerApi.createContainer({ name: toCreate });
                if (created) {
                  setOptions((prev) => [created, ...prev]);
                  field.onChange(created.id);
                }
              } catch (e) {
                console.error('Create container failed', e);
              }
            }}
            filterOptions={(opts, params) => {
              const base: Option[] = opts;

              const filtered = filter(base, params);
              const { inputValue } = params;

              const exists = opts.some(
                (o) => o.name.toLowerCase() === inputValue.toLowerCase()
              );

              if (inputValue !== '' && !exists) {
                filtered.unshift({
                  __add: true,
                  inputValue,
                  name: `Add "${inputValue}"`,
                });
              }
              return filtered;
            }}
            selectOnFocus
            handleHomeEndKeys
            clearOnBlur
            options={options as Option[]}
            getOptionLabel={(opt) => {
              if (isAddOption(opt)) return opt.name;
              return opt.name;
            }}
            isOptionEqualToValue={(a, b) => {
              if (isAddOption(a) || isAddOption(b)) return false;
              return a.id === b.id;
            }}
            loading={loading}
            disabled={disabled}
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