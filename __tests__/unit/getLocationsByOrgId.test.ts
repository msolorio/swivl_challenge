import { getLocationsByOrgId } from '#app/services/getLocationsByOrgId'
import { AbstractRepo, FetchedLocations, FetchedVars } from '#app/repositories/apiRepository'
import { RequestedVars, OrgId, LocationId } from '#app/types.js'


class FakeApiRepo implements AbstractRepo {
  private locations: FetchedLocations
  private variables: FetchedVars

  constructor({ locations, variables }: {
    locations: FetchedLocations, variables: FetchedVars
  }) {
    this.locations = locations
    this.variables = variables
  }

  async getLocations() {
    return this.locations
  }

  async getVariables() {
    return this.variables
  }
}

describe('getLocationsByOrgId', () => {
  it('returns the locations for the given org id', async () => {
    const locationId1 = 1 as LocationId
    const locationId2 = 2 as LocationId
    const orgId = 1 as OrgId

    const fakeApiRepo = new FakeApiRepo({
      locations: [{ id: locationId1, orgId }, { id: locationId2, orgId }],
      variables: [
        { id: 1, orgId, locationId: locationId1, key: 'testKey', value: 'loc1Value' },
        { id: 2, orgId, locationId: (null as unknown as LocationId), key: 'orgKey', value: 'orgValue' }
      ]
    })

    const result = await getLocationsByOrgId({
      apiRepo: fakeApiRepo,
      orgId: 1 as OrgId,
      requestedVars: ['testKey', 'orgKey'] as RequestedVars
    })

    expect(result).toEqual([
      {
        location: { id: 1, orgId: 1 },
        variables: {
          testKey: { value: 'loc1Value', inheritance: 'location' },
          orgKey: { value: 'orgValue', inheritance: 'org' }
        }
      },
      {
        location: { id: 2, orgId: 1 },
        variables: {
          testKey: { value: null, inheritance: null },
          orgKey: { value: 'orgValue', inheritance: 'org' }
        }
      }
    ])
  })
})
