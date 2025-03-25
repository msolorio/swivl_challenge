import { LocationId, OrgId, RequestedVars } from "#app/types";
import { AbstractRepo } from "#app/repositories/apiRepository";
import { OrgIdNotFoundError } from "#app/errors";

type ResultLocation = {
  location: { id: LocationId; orgId: OrgId }
  variables: {
    [key: string]: {
      value: string | null
      inheritance: string | null
    }
  }
}

async function getLocationsByOrgId({ apiRepo, orgId, requestedVars }: {
  apiRepo: AbstractRepo,
  orgId: OrgId,
  requestedVars: RequestedVars
}): Promise<Array<ResultLocation>> {
  const fetchedLocations = await apiRepo.getLocations()
  const fetchedVars = await apiRepo.getVariables()

  const locations = fetchedLocations.map(location => new Location(
    location.id,
    location.orgId,
    requestedVars
  ))
  const locationsForOrg = getLocationsForOrgId(locations, orgId)

  const variables = fetchedVars.map(variable => new Variable(
    variable.value,
    variable.key,
    variable.orgId,
    variable.locationId,
  )).filter(variable => variable.isRelevent(orgId, requestedVars))

  return mergeVarsToLocations(locationsForOrg, variables)
}


function mergeVarsToLocations(locations: Array<Location>, variables: Array<Variable>): Array<ResultLocation> {
  return locations.map(location => {
    const orgVars = variables.filter(v => v.isOrgVariable)
    const locationVars = variables.filter(v => v.isForLocation(location))

    location.applyOrgVars(orgVars)
    location.applyLocationVars(locationVars)

    return location.data
  })
}

function getLocationsForOrgId(locations: Array<Location>, orgId: OrgId): Array<Location> {
  const locationsForOrg = locations.filter(location => location.isForOrgId(orgId))
  if (locationsForOrg.length === 0) {
    throw new OrgIdNotFoundError('No locations found for orgId')
  }
  return locationsForOrg
}

class Location {
  private _data: ResultLocation

  constructor(
    private locationId: LocationId,
    private orgId: OrgId,
    private requestedVars: RequestedVars
  ) {
    this._data = this.init()
  }

  init(): ResultLocation {
    return {
      location: {
        id: this.locationId,
        orgId: this.orgId
      },
      variables: Object.fromEntries(
        this.requestedVars.map(variable => [variable, { value: null, inheritance: null }])
      )
    }
  }

  applyVars(vars: Array<Variable>, inheritance: string) {
    vars.forEach(variable => this.setVariable(variable.key, variable.value, inheritance))
  }

  applyOrgVars(orgVars: Array<Variable>) {
    this.applyVars(orgVars, 'org')
  }

  applyLocationVars(locationVars: Array<Variable>) {
    this.applyVars(locationVars, 'location')
  }

  get id() {
    return this._data.location.id
  }

  isForOrgId(orgId: OrgId) {
    return this.orgId === orgId
  }

  setVariable(key: string, value: string | null, inheritance: string) {
    this._data.variables[key] = { value, inheritance }
  }

  get data() {
    return this._data
  }
}

class Variable {
  constructor(
    private _value: string | null,
    private _key: string,
    private _orgId: OrgId,
    private _locationId: LocationId
  ) { }

  get value() {
    return this._value
  }

  get key() {
    return this._key
  }

  isRelevent(orgId: OrgId, requestedVars: RequestedVars) {
    return this._orgId === orgId && requestedVars.includes(this._key)
  }

  get isOrgVariable() {
    return this._locationId === null
  }

  isForLocation(location: Location) {
    return this._locationId === location.id
  }
}

export {
  getLocationsByOrgId
}

