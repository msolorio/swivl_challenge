import { LocationId, VariableKey, VariableValue, OrgId, RequestedVars } from "#app/types.js"
import { Location } from "#app/domain/Location.js"

abstract class Variable {
  constructor(
    protected _value: VariableValue,
    protected _key: VariableKey,
    protected _orgId: OrgId,
    private _locationId: LocationId
  ) { }

  abstract applyToLocation(location: Location): void

  static create(
    value: VariableValue,
    key: VariableKey,
    orgId: OrgId,
    locationId: LocationId
  ) {
    if (locationId === null) {
      return new OrgVariable(value, key, orgId, locationId)
    } else {
      return new LocationVariable(value, key, orgId, locationId)
    }
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

class LocationVariable extends Variable {
  applyToLocation(location: Location) {
    this.isForLocation(location)
      && this.isForOrg(location.orgId)
      && location.setLocationVar(this._key, this._value)
  }
}

class OrgVariable extends Variable {
  applyToLocation(location: Location) {
    this.isForOrg(location.orgId)
      && location.setOrgVar(this._key, this._value)
  }
}

export {
  Variable
}