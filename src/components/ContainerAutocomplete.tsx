import { FieldValues } from 'react-hook-form';
import { ContainerRow, ContainerApiService } from '../services/container-api-service';
import { ResourceAutocomplete } from './ResourceAutocomplete';

type ContainerAutocompleteProps<FV extends FieldValues> = Omit<
  React.ComponentProps<typeof ResourceAutocomplete<FV, ContainerRow>>,
  'label' | 'fetchAll' | 'createOne'
>;

export const ContainerAutocomplete = <FV extends FieldValues>(
  props: ContainerAutocompleteProps<FV>
) => (
  <ResourceAutocomplete<FV, ContainerRow>
    {...props}
    label="Container"
    fetchAll={ContainerApiService.getContainers}
    createOne={ContainerApiService.createContainer}
    freeSolo
  />
);
