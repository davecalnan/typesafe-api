/**
 * Lies to TypeScript and says a UUID is a number so we can
 * better infer API routes.
 */
export const uuid = (uuid: string): number => {
  return uuid as unknown as number;
};
