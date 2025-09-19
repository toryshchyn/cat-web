import { Control, FieldValues, Path } from 'react-hook-form';
import { useResourceAutocomplete } from '../hooks/useResourceAutocomplete';
import { BaseAutocomplete } from './BaseAutocomplete';

type Props<FV extends FieldValues, T extends { id: number; name: string }> = {
  control: Control<FV>;
  name: Path<FV>;
  label: string;
  fetchAll: () => Promise<T[]>;
  createOne: (data: { name: string }) => Promise<T | null>;
  multiple?: boolean;
  freeSolo?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
};

export function ResourceAutocomplete<
  FV extends FieldValues,
  T extends { id: number; name: string }
>({
  control,
  name,
  label,
  fetchAll,
  createOne,
  multiple,
  freeSolo,
  disabled,
  error,
  helperText
}: Props<FV, T>) {
  const { options, loading, addOne } = useResourceAutocomplete(fetchAll, createOne);

  return (
    <BaseAutocomplete<FV, T>
      control={control}
      name={name}
      label={label}
      disabled={disabled}
      options={options}
      loading={loading}
      addOne={addOne}
      multiple={multiple}
      freeSolo={freeSolo}
      error={error}
      helperText={helperText}
    />
  );
}
