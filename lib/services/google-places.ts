import { googleApi } from '../apis/google.api';
import { SearchPlacesResponse } from '../schemas/google-places';

export const googlePlacesApi = googleApi.injectEndpoints({
  endpoints: (builder) => ({
    getAutocomplete: builder.query<SearchPlacesResponse, string>({
      query: (input) => ({
        url: '',
        params: {
          input: input,
        },
      }),
    }),
  }),
});

export const {
  useLazyGetAutocompleteQuery
} = googlePlacesApi;
