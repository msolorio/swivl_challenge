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

  return mergeVarsToLocations(filteredLocations, variables)
}


function mergeVarsToLocations(locations: Array<Location>, variables: Array<Variable>): Array<ResultLocation> {
  locations.forEach(location => {
    variables.forEach(v => v.applyToLocation(location))
  })

  return locations.map(l => l.data)
}

export {
  getLocationsByOrgId,
}

