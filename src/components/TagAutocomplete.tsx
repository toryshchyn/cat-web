import { FieldValues } from 'react-hook-form';
import { TagRow, TagApiService } from '../services/tag-api-service';
import { ResourceAutocomplete } from './ResourceAutocomplete';

type TagAutocompleteProps<FV extends FieldValues> = Omit<
  React.ComponentProps<typeof ResourceAutocomplete<FV, TagRow>>,
  'label' | 'fetchAll' | 'createOne'
>;

export const TagAutocomplete = <FV extends FieldValues>(
  props: TagAutocompleteProps<FV>
) => (
  <ResourceAutocomplete<FV, TagRow>
    {...props}
    label="Tags"
    fetchAll={TagApiService.getTags}
    createOne={TagApiService.createTag}
    multiple
    freeSolo
  />
);
