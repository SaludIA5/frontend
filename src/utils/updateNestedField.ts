import type { Patient } from "../types/user";

export function updateNestedField<T extends keyof Patient>(
  prev: Patient,
  section: T,
  key: keyof NonNullable<Patient[T]>,
  value: unknown
): Patient {
  return {
    ...prev,
    [section]: {
      ...(prev[section] as object),
      [key]: value,
    },
  };
}