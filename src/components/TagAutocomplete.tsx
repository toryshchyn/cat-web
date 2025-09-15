import { Control, FieldValues, Path } from 'react-hook-form';
import { TagRow, TagApi } from '../services/tags';
import { useResourceAutocomplete } from '../hooks/useResourceAutocomplete';
import { BaseAutocomplete } from './BaseAutocomplete';
import { useAuth0 } from '@auth0/auth0-react';

type Props<FV extends FieldValues> = {
  control: Control<FV>;
  name: Path<FV>;
  label?: string;
  disabled?: boolean;
};

export function TagAutocomplete<FV extends FieldValues>({
  control,
  name,
  label = 'Tags',
  disabled,
}: Props<FV>) {
  const { getAccessTokenSilently } = useAuth0();

  const { options, loading, addOne } = useResourceAutocomplete(
    () => TagApi.getTags(getAccessTokenSilently),
    (data) => TagApi.createTag(data, getAccessTokenSilently)
  );

  return (
    <BaseAutocomplete<FV, TagRow>
      control={control}
      name={name}
      label={label}
      disabled={disabled}
      options={options}
      loading={loading}
      addOne={addOne}
      multiple
      freeSolo
    />
  );
}
