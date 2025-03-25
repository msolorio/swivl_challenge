import { getLocationsByOrgId } from '#app/services/index.js'
import { AbstractRepo } from '#app/repositories/apiRepository'
import { RequestedVars, OrgId, LocationId, VariableKey, VariableValue } from '#app/types.js'
import { Variable } from '#app/domain/Variable.js'
import { Location } from '#app/domain/Location.js'


class FakeApiRepo implements AbstractRepo {
  private locations: Array<Location>
  private variables: Array<Variable>

  constructor({ locations, variables }: {
    locations: Array<Location>,
    variables: Array<Variable>
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
  const locationId1 = 1 as LocationId
  // const locationId2 = 2 as LocationId
  const locationIdNull = null
  const orgId1 = 1 as OrgId
  const orgId2 = 2 as OrgId
  const testKey1 = 'testKey1' as VariableKey
  const testKey2 = 'testKey2' as VariableKey
  const locValue1 = 'locValue1' as VariableValue
  const locValue2 = 'locValue2' as VariableValue
  const orgKey = 'orgKey' as VariableKey
  const orgValue = 'orgValue' as VariableValue
  // const requestedVars = [testKey1, orgKey] as RequestedVars

  it('applies location and org variables to the locations', async () => {
    const fakeApiRepo = new FakeApiRepo({
      locations: [
        new Location(locationId1, orgId1),
      ],
      variables: [
        Variable.create(locValue1, testKey1, orgId1, locationId1),
        Variable.create(orgValue, orgKey, orgId1, locationIdNull)
      ]
    })

    const result = await getLocationsByOrgId({
      apiRepo: fakeApiRepo,
      orgId: orgId1,
      requestedVars: [testKey1, orgKey] as RequestedVars
    })

    expect(result).toEqual([
      {
        location: { id: locationId1, orgId: orgId1 },
        variables: {
          [testKey1]: { value: locValue1, inheritance: 'location' },
          [orgKey]: { value: orgValue, inheritance: 'org' }
        }
      }
    ])
  })

  it('does not apply variables with incorrect org id', async () => {
    const fakeApiRepo = new FakeApiRepo({
      locations: [
        new Location(locationId1, orgId1),
      ],
      variables: [
        Variable.create(locValue1, testKey1, orgId1, locationId1),
        Variable.create(orgValue, orgKey, orgId2, locationIdNull)
      ]
    })

    const result = await getLocationsByOrgId({
      apiRepo: fakeApiRepo,
      orgId: orgId1,
      requestedVars: [testKey1, orgKey] as RequestedVars
    })

    expect(result).toEqual([
      {
        location: { id: locationId1, orgId: orgId1 },
        variables: {
          [testKey1]: { value: locValue1, inheritance: 'location' },
          [orgKey]: { value: null, inheritance: null }
        }
      }
    ])
  })

  it('does not apply unrequested variables', async () => {
    const fakeApiRepo = new FakeApiRepo({
      locations: [
        new Location(locationId1, orgId1),
      ],
      variables: [
        Variable.create(locValue1, testKey1, orgId1, locationId1),
        Variable.create(locValue2, testKey2, orgId1, locationId1)
      ]
    })

    const result = await getLocationsByOrgId({
      apiRepo: fakeApiRepo,
      orgId: orgId1,
      requestedVars: [testKey1] as RequestedVars
    })

    expect(result).toEqual([
      {
        location: { id: locationId1, orgId: orgId1 },
        variables: { [testKey1]: { value: locValue1, inheritance: 'location' } }
      }
    ])
  })

  it('org var does not override location var if it is already set', async () => {
    const fakeApiRepo = new FakeApiRepo({
      locations: [
        new Location(locationId1, orgId1),
      ],
      variables: [
        Variable.create(locValue1, testKey1, orgId1, locationId1),
        Variable.create(orgValue, testKey1, orgId1, locationIdNull)
      ]
    })

    const result = await getLocationsByOrgId({
      apiRepo: fakeApiRepo,
      orgId: orgId1,
      requestedVars: [testKey1] as RequestedVars
    })

    expect(result).toEqual([
      {
        location: { id: locationId1, orgId: orgId1 },
        variables: { [testKey1]: { value: locValue1, inheritance: 'location' } }
      }
    ])
  })
})
