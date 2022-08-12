export type Require<
  Object extends Record<string, any>,
  RequiredKeys extends keyof Object
> = Omit<Object, RequiredKeys> & {
  [Key in RequiredKeys]: NonNullable<Object[Key]>;
};

export type RequireId<Object extends { id: any }> = Require<Object, "id">;

export type RequireIdIfPresent<Data> = Data extends { id: any }
  ? RequireId<Data>
  : null;
