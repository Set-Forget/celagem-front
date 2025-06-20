import { NewUser, NewUserResponse, UserDetailResponse, UserListResponse } from '@/app/(private)/management/users/schema/users';
import { AdaptedUserDetail, AdaptedUserList, getUserAdapter, listUsersAdapter } from '../adapters/users';
import { usersApi } from '../apis/users-api';
import { doctorsApi } from './doctors';

export const userApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query<AdaptedUserList[], { company_id?: string, name?: string } | void>({
      query: (data) => ({
        url: `users`,
        params: data || {},
      }),
      transformResponse: (response: UserListResponse) => response.data.map(listUsersAdapter),
      providesTags: ['User'],
    }),
    createUser: builder.mutation<NewUserResponse, NewUser>({
      async queryFn(userData, _queryApi, _extraOptions, baseQuery) {
        const { role_is_medical, speciality_id, signature, ...rest } = userData as any;

        const userResult = await baseQuery({
          url: 'users',
          method: 'POST',
          body: rest,
        });

        if (userResult.error) return { error: userResult.error } as any;

        const userResponse = userResult.data as NewUserResponse;
        if (role_is_medical) {
          try {
            await _queryApi.dispatch(
              doctorsApi.endpoints.createDoctor.initiate({
                id: userResponse.data.id,
                signature: `${userData.first_name} ${userData.last_name}`,
                speciality_id: Number(speciality_id),
                image: signature?.split(',')[1] || '',
              })
            ).unwrap();
          } catch (err) {
            return { error: err } as any;
          }
        }
        return { data: userResponse } as any;
      },
      invalidatesTags: ['User'],
    }),
    getUser: builder.query<AdaptedUserDetail, string>({
      async queryFn(id, _queryApi, _extraOptions, baseQuery) {
        const userResult = await baseQuery({
          url: `users/${id}`,
          method: 'GET',
        });

        if (userResult.error) return { error: userResult.error } as any;

        const userResponse = userResult.data as UserDetailResponse;
        const isMedicalRole = userResponse.data.role_is_medical;

        let speciality_name: string | undefined;
        let signature: string | undefined;
        let specialization_id: number | undefined;

        if (isMedicalRole) {
          try {
            const doctorData = await _queryApi.dispatch(doctorsApi.endpoints.getDoctor.initiate(id)).unwrap();

            speciality_name = doctorData.specialization_name;
            signature = doctorData.signature;
            specialization_id = doctorData.specialization_id;
          } catch (err) {
            throw err;
          }
        }

        return {
          data: getUserAdapter({
            ...userResponse.data,
            speciality_name,
            signature,
            specialization_id,
          })
        };
      },
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<NewUserResponse, { id: string; body: Partial<NewUser> }>({
      async queryFn({ id, body }, _queryApi, _extraOptions, baseQuery) {
        const { role_is_medical, speciality_id, signature, role_id } = body;

        const userResult = await baseQuery({
          url: `users/${id}`,
          method: 'PUT',
          body: body,
        });

        if (userResult.error) return { error: userResult.error } as any;

        const userResponse = userResult.data as NewUserResponse;

        if (role_id) {
          const roleResult = await baseQuery({
            url: `users/${id}/update-role`,
            method: 'POST',
            body: { role_id },
          });

          if (roleResult.error) return { error: roleResult.error } as any;
        }

        if (role_is_medical) {
          try {
            await _queryApi.dispatch(
              doctorsApi.endpoints.updateDoctor.initiate({
                id: id,
                speciality_id: speciality_id as number | undefined,
                image: signature?.split(',')[1] ?? undefined,
              })
            ).unwrap();
          } catch (err) {
            return { error: err } as any;
          }
        }
        return { data: userResponse } as any;
      },
      invalidatesTags: ['User'],
    }),
    updateUserRole: builder.mutation<NewUserResponse, { id: string; body: { role_id: string } }>({
      query: ({ id, body }) => ({
        url: `users/${id}/update-role`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useListUsersQuery,
  useLazyListUsersQuery,
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
} = userApi;
