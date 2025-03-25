import { RequestedVars, LocationId, OrgId, VariableKey, VariableValue, ResultLocation, Inheritance } from "#app/types.js"
import { Variable } from "#app/domain/Variable.js"

class Location {
  private _data: ResultLocation

  constructor(
    private locationId: LocationId,
    private orgId: OrgId,
  ) {
    this._data = this.init()
  }

  init(): ResultLocation {
    return {
      location: {
        id: this.locationId,
        orgId: this.orgId
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

  applyOrgVars(orgVars: Array<Variable>) {
    this.applyVars(orgVars, 'org')
  }

  applyLocationVars(locationVars: Array<Variable>) {
    this.applyVars(locationVars, 'location')
  }

  applyVars(vars: Array<Variable>, inheritance: Inheritance) {
    vars.forEach(variable => this.setVariable(variable.key, variable.value, inheritance))
  }

  setVariable(key: VariableKey, value: VariableValue, inheritance: Inheritance) {
    this._data.variables[key] = { value, inheritance }
  }

  get id() {
    return this._data.location.id
  }

  isForOrg(orgId: OrgId) {
    return this.orgId === orgId
  }

  get data() {
    return this._data
  }
}

export {
  Location
}
