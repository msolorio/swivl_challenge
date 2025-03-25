import {
  RequestedVars,
  LocationId,
  OrgId,
  VariableKey,
  VariableValue,
  ResultLocation,
  Inheritance
} from "#app/types"

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

  setOrgVar(variableKey: VariableKey, variableValue: VariableValue) {
    this.setVariable(variableKey, variableValue, 'org')
  }

  setLocationVar(variableKey: VariableKey, variableValue: VariableValue) {
    this.setVariable(variableKey, variableValue, 'location')
  }

  setVariable(key: VariableKey, value: VariableValue, inheritance: Inheritance) {
    if (this.hasVariable(key) && !this.hasVariableSet(key)) {
      this._data.variables[key] = { value, inheritance }
    }
  }

  get id() {
    return this._data.location.id
  }

  get orgId() {
    return this._orgId
  }

  isForOrg(orgId: OrgId) {
    return this.orgId === orgId
  }

  hasVariableSet(key: VariableKey) {
    return this._data.variables[key].value !== null
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
