// Warning: This file has been synced from chironapp. Do not modify or it will be overwritten.

/**
 * Calculate pagination parameters for Supabase queries
 * @param page - The page number (0-indexed)
 * @param size - The page size
 * @returns Object with from and to indices
 */
export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};
