type Brand<T, B> = T & { __brand: B };

export type OrgId = Brand<number, 'OrgId'>
export type RequestedVars = Brand<Array<string>, 'RequestedVars'>
