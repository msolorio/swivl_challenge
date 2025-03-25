type Brand<T, B> = T & { __brand: B };

export type OrgId = Brand<number, 'OrgId'>
export type LocationId = Brand<number, 'LocationId'> | null
export type VariableKey = Brand<string, 'VariableKey'>
export type VariableValue = Brand<string, 'VariableValue'> | null
export type RequestedVars = Brand<Array<VariableKey>, 'RequestedVars'>
export type Inheritance = 'org' | 'location' | null

export type ResultLocation = {
  location: { id: LocationId; orgId: OrgId }
  variables: {
    [key: VariableKey]: {
      value: VariableValue
      inheritance: Inheritance
    }
  }
}