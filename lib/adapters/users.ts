import { UserDetail, UserList } from "@/app/(private)/management/users/schema/users";

export function listUsersAdapter(data: UserList) {
  return {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    role: {
      id: data.role_id,
      name: data.role_name,
      is_medical: data.role_is_medical,
    },
    company: {
      id: data.company_id,
      name: data.company_name,
    },
  }
}

export function getUserAdapter(data: UserDetail & { speciality_name?: string; signature?: string; specialization_id?: number }) {
  return {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    role: {
      id: data.role_id,
      name: data.role_name,
      is_medical: data.role_is_medical,
    },
    business_units: data.business_units.map((bu) => ({
      id: bu.id,
      name: bu.name,
    })),
    company: {
      id: data.company_id,
      name: data.company_name,
    },
    speciality: {
      id: data.specialization_id,
      name: data.speciality_name,
    },
    signature: data.signature,
    created_at: data.created_at,
    modified_at: data.modified_at,
  }
}

export type AdaptedUserList = ReturnType<typeof listUsersAdapter>;
export type AdaptedUserDetail = ReturnType<typeof getUserAdapter>;
