import { LocationId, VariableKey, VariableValue, OrgId, RequestedVars } from "#app/types.js"
import { Location } from "#app/domain/Location.js"

class Variable {
  constructor(
    private _value: VariableValue,
    private _key: VariableKey,
    private _orgId: OrgId,
    private _locationId: LocationId
  ) { }

  get value() {
    return this._value
  }

  get key() {
    return this._key
  }

  get isOrgVariable() {
    return this._locationId === null
  }

  isForOrg(orgId: OrgId) {
    return this._orgId === orgId
  }

  isRequested(requestedVars: RequestedVars) {
    return requestedVars.includes(this._key)
  }

  isForLocation(location: Location) {
    return this._locationId === location.id
  }
}

export {
  Variable
}