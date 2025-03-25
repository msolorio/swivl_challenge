import axios, { AxiosError, AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'
import { z, ZodError } from 'zod'
import { ExternalApiError, SchemaValidationError } from '#app/errors'
import { LocationId, OrgId, VariableKey, VariableValue } from '#app/types'
import { Variable } from '#app/domain/Variable'
import { Location } from '#app/domain/Location'

type FetchedLocations = Array<{ id: LocationId; orgId: OrgId }>
type FetchedVars = Array<{
  id: number
  orgId: OrgId
  locationId: LocationId
  key: VariableKey
  value: VariableValue
}>

interface AbstractRepo {
  getLocations: () => Promise<Array<Location>>
  getVariables: () => Promise<Array<Variable>>
}

class ApiRepo implements AbstractRepo {
  private client: AxiosInstance

  constructor() {
    const baseURL = 'https://swivl-interview-e61c73ef3cf5.herokuapp.com/api'
    this.client = axios.create({ baseURL })
    axiosRetry(this.client, { retries: 3, retryDelay: axiosRetry.exponentialDelay })
  }

  async get(path: string) {
    try {
      const response = await this.client.get(path)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('ExternalApiError:', error.response?.data)
        throw new ExternalApiError()

      } else if (error instanceof ZodError) {
        console.error('SchemaValidationError:', error.message)
        throw new SchemaValidationError()
      }

      throw error
    }
  }

  async getLocations(): Promise<Array<Location>> {
    const locations = await this.get('/locations')

    const LocationsSchema = z.array(z.object({
      id: z.number(),
      orgId: z.number(),
    }))
    const parsedLocations = LocationsSchema.parse(locations) as FetchedLocations

    return parsedLocations.map(location => new Location(
      location.id,
      location.orgId,
    ))
  }

  async getVariables(): Promise<Array<Variable>> {
    const fetchedVariables = await this.get('/variables')

    const VariablesSchema = z.array(z.object({
      id: z.number(),
      orgId: z.number(),
      locationId: z.number().nullable(),
      key: z.string(),
      value: z.string().nullable(),
    }))
    const parsedVariables = VariablesSchema.parse(fetchedVariables) as FetchedVars

    return parsedVariables.map(variable => Variable.create(
      variable.value,
      variable.key,
      variable.orgId,
      variable.locationId,
    ))
  }
}

export {
  AbstractRepo,
  ApiRepo,
  FetchedLocations,
  FetchedVars
}
