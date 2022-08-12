/**
 * Convinces TypeScript a UUID is a number so we can better infer API endpoints.
 */
export const uuid = (uuid: string): number => {
  return uuid as unknown as number;
};
