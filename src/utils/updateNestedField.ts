import type { Episode } from "../types/episode";

export function updateNestedField<T extends keyof Episode>(
  prev: Episode,
  section: T,
  key: keyof NonNullable<Episode[T]>,
  value: unknown
): Episode {
  return {
    ...prev,
    [section]: {
      ...(prev[section] as object),
      [key]: value,
    },
  };
}