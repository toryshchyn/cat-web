import { Control, FieldValues, Path } from 'react-hook-form';
import { ContainerRow, ContainerApi } from '../services/containers';
import { useResourceAutocomplete } from '../hooks/useResourceAutocomplete';
import { BaseAutocomplete } from './BaseAutocomplete';
import { useAuth0 } from '@auth0/auth0-react';

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
  const { getAccessTokenSilently } = useAuth0();

  const { options, loading, addOne } = useResourceAutocomplete(
    () => ContainerApi.getContainers(getAccessTokenSilently),
    (data) => ContainerApi.createContainer(data, getAccessTokenSilently)
  );

  return (
    <BaseAutocomplete<FV, ContainerRow>
      control={control}
      name={name}
      label={label}
      disabled={disabled}
      options={options}
      loading={loading}
      addOne={addOne}
      freeSolo
    />
  );
}
