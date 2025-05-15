import { NewField, NewFieldResponse, NewSection, NewSectionResponse, NewTemplate, NewTemplateResponse, SectionDetail, SectionDetailResponse, SectionListResponse, TemplateDetail, TemplateDetailResponse, TemplateListResponse } from '@/app/(private)/medical-management/(masters)/schemas/templates';
import { hcApi } from '@/lib/apis/hc-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const templatesApi = hcApi.injectEndpoints({
  endpoints: (builder) => ({
    //--- Templates ---
    listTemplates: builder.query<
      TemplateListResponse,
      { name?: string } | void
    >({
      query: (data) => ({
        url: 'template',
        params: data || {},
      }),
      providesTags: ['Template'],
    }),
    getTemplate: builder.query<TemplateDetail, number>({
      query: (id) => `template/${id}`,
      transformResponse: (response: TemplateDetailResponse) => response.data,
      providesTags: ['Template'],
    }),
    updateTemplate: builder.mutation<NewTemplateResponse, NewTemplate>({
      query: ({ id, ...newTemplate }) => ({
        url: `template/${id}`,
        method: 'PATCH',
        body: newTemplate,
      }),
      invalidatesTags: ['Template'],
    }),
    createTemplate: builder.mutation<NewTemplateResponse, NewTemplate>({
      query: (newTemplate) => ({
        url: 'template',
        method: 'POST',
        body: {
          ...newTemplate,
          created_by: '0194cd16-08cb-7146-b224-52417ab62d3b'
        }
      }),
      invalidatesTags: ['Template'],
    }),

    //--- Sections ---
    createSection: builder.mutation<
      NewSectionResponse,
      Omit<NewSection, 'fields'> & { fields?: number[] }
    >({
      query: ({ id, ...newSection }) => ({
        url: 'section',
        method: 'POST',
        body: newSection,
      }),
      invalidatesTags: ['Section'],
    }),
    updateSection: builder.mutation<
      NewSectionResponse,
      Omit<NewSection, 'id'> & { id: number }
    >({
      query: ({ id, ...newSection }) => ({
        url: `section/${id}`,
        method: 'PUT',
        body: newSection,
      }),
      invalidatesTags: ['Section'],
    }),
    listSections: builder.query<SectionListResponse, { name?: string } | void>({
      query: (data) => ({
        url: 'section',
        params: data || {}
      }),
      providesTags: ['Section']
    }),
    getSection: builder.query<SectionDetail, number>({
      query: (id) => `section/${id}`,
      transformResponse: (response: SectionDetailResponse) => response.data,
      providesTags: ['Section']
    }),
    deleteSection: builder.mutation<NewSectionResponse, number>({
      query: (id) => ({
        url: `section/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Section']
    }),

    //--- Fields ---
    createField: builder.mutation<NewFieldResponse, NewField>({
      query: ({ id, section_id, ...newField }) => ({
        url: 'field',
        method: 'POST',
        body: newField,
      }),
      invalidatesTags: ['Field'],
    }),
    updateField: builder.mutation<
      NewFieldResponse,
      Omit<NewField, 'id'> & { id: number }
    >({
      query: ({ id, section_id, ...newField }) => ({
        url: `field/${id}`,
        method: 'PUT',
        body: newField,
      }),
      invalidatesTags: ['Field'],
    }),
  }),
});

export const {
  useListTemplatesQuery,
  useGetTemplateQuery,
  useLazyGetTemplateQuery,
  useLazyListTemplatesQuery,

  useGetSectionQuery,
  useListSectionsQuery,
  useLazyListSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useLazyGetSectionQuery,
  useDeleteSectionMutation,

  useCreateFieldMutation,
  useUpdateFieldMutation,

  useUpdateTemplateMutation,
  useCreateTemplateMutation,
} = templatesApi;
