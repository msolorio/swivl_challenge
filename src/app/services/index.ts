import { OrgId, RequestedVars, ResultLocation } from "#app/types";
import { AbstractRepo } from "#app/repositories/apiRepository";
import { Location } from "#app/domain/Location";
import { Variable } from "#app/domain/Variable";
import { OrgIdNotFoundError } from "#app/errors";


async function getLocationsByOrgId({ apiRepo, orgId, requestedVars }: {
  apiRepo: AbstractRepo,
  orgId: OrgId,
  requestedVars: RequestedVars
}): Promise<Array<ResultLocation>> {
  const locations = await apiRepo.getLocations()
  const variables = await apiRepo.getVariables()

  const filteredLocations = locations
    .filter(l => l.isForOrg(orgId))
    .map(l => l.initVarsMap(requestedVars))

  if (!filteredLocations.length) {
    throw new OrgIdNotFoundError('No locations found for orgId')
  }

  const filteredVars = variables
    .filter(v => v.isForOrg(orgId) && v.isRequested(requestedVars))

  return mergeVarsToLocations(filteredLocations, filteredVars)
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

export {
  getLocationsByOrgId,
}

