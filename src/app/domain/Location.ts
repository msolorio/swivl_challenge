import {
  RequestedVars,
  LocationId,
  OrgId,
  VariableKey,
  // VariableValue,
  ResultLocation,
  Inheritance,
  // Inheritance
} from "#app/types"
import { Variable } from "#app/domain/Variable"
class Location {
  private _data: ResultLocation

  constructor(
    private _locationId: LocationId,
    private _orgId: OrgId,
  ) {
    this._data = this.init()
  }

  init(): ResultLocation {
    return {
      location: {
        id: this._locationId,
        orgId: this._orgId
      },
      variables: {}
    }
  }

  initVarsMap(requestedVars: RequestedVars) {
    this._data.variables = Object.fromEntries(
      requestedVars.map(variable => [variable, { value: null, inheritance: null }])
    )

    return this
  }

  setOrgVar(variable: Variable) {
    if (!this.hasVariableSet(variable.key)) {
      this.setVariable(variable, 'org')
    }
  }

  setLocationVar(variable: Variable) {
    if (this.matchesLocationId(variable.locationId)) {
      this.setVariable(variable, 'location')
    }
  }

  setVariable(variable: Variable, inheritance: Inheritance) {
    if (this.hasVariable(variable.key) && this.matchesOrgId(variable.orgId)) {
      this._data.variables[variable.key] = { value: variable.value, inheritance }
    }
  }

  get id() {
    return this._locationId
  }

  matchesOrgId(orgId: OrgId) {
    return this._orgId === orgId
  }

  matchesLocationId(locationId: LocationId) {
    return this._locationId === locationId
  }

  hasVariableSet(key: VariableKey) {
    return this._data.variables[key]?.value !== null
  }

  hasVariable(key: VariableKey) {
    return this._data.variables[key] !== undefined
  }

  get data() {
    return this._data
  }
}

export {
  Location
}
