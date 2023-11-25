export const transformObjectToArray = <T extends object>(
  data: Record<string, T> | null,
): (T & { id: string })[] => {
  if (!data) return [];
  return Object.entries(data).map(([id, value]) => ({
    ...value,
    id,
  }));
};
