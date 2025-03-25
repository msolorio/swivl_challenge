type Brand<T, B> = T & { __brand: B };

export type OrgId = Brand<number, 'OrgId'>
export type LocationId = Brand<number | null, 'LocationId'>
export type RequestedVars = Brand<Array<string>, 'RequestedVars'>
