import { AbstractRepo } from '#app/repositories/apiRepository'

type GetLocationsByOrgIdParams = {
  apiRepo: AbstractRepo
  orgId: string
  variables: string[]
}

async function getLocationsByOrgId({ apiRepo, orgId, variables }: GetLocationsByOrgIdParams) {

  // const fetchedLocations = await apiRepo.getLocations()
  // const fetchedVariables = await apiRepo.getVariables()

  // logic to merge locations and variables
  apiRepo
  orgId
  variables

  return []
}

export {
  getLocationsByOrgId
}

