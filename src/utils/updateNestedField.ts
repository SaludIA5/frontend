import type { User } from "../types/user";

export function updateNestedField<T extends keyof User>(
  prev: User,
  section: T,
  key: keyof NonNullable<User[T]>,
  value: unknown
): User {
  return {
    ...prev,
    [section]: {
      ...(prev[section] as object),
      [key]: value,
    },
  };
}