import { LocationId, VariableKey, VariableValue, OrgId } from "#app/types.js"
import { Location } from "#app/domain/Location.js"

abstract class Variable {
  constructor(
    public value: VariableValue,
    public key: VariableKey,
    public orgId: OrgId,
    public locationId: LocationId
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
}

class LocationVariable extends Variable {
  applyToLocation(location: Location) {
    location.setLocationVar(this)
  }
}

class OrgVariable extends Variable {
  applyToLocation(location: Location) {
    location.setOrgVar(this)
  }
}

export {
  Variable
}