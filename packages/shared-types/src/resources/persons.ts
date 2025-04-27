export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email?: string;
  phone_number?: string;
  occupation?: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface GetPerson {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  occupation: string | null;
}

export interface CreatePerson {
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  gender?: "male" | "female" | "non-binary" | "other" | "prefer_not_to_say";
  email?: string;
  phone?: string;
  address?: string;
  occupation?: string;
}

export interface UpdatePerson {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | null;
  gender?: "male" | "female" | "non-binary" | "other" | "prefer_not_to_say";
  email?: string;
  phone?: string;
  address?: string;
  occupation?: string;
}
