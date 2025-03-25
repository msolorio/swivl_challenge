import axios, { AxiosError, AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'
import { z, ZodError } from 'zod'
import { ExternalApiError, SchemaValidationError } from '#app/errors'
import { LocationId, OrgId } from '#app/types'


interface AbstractRepo {
  getLocations: () => Promise<FetchedLocations>
  getVariables: () => Promise<FetchedVars>
}

type FetchedLocations = Array<{ id: LocationId; orgId: OrgId }>
type FetchedVars = Array<{
  id: number
  orgId: OrgId
  locationId: LocationId
  key: string
  value: string
}>


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

  async getLocations(): Promise<FetchedLocations> {
    const LocationsSchema = z.array(z.object({
      id: z.number(),
      orgId: z.number(),
    }))

    const locations = await this.get('/locations')

    return LocationsSchema.parse(locations) as FetchedLocations
  }

  async getVariables(): Promise<FetchedVars> {
    const VariablesSchema = z.array(z.object({
      id: z.number(),
      orgId: z.number(),
      locationId: z.number().nullable(),
      key: z.string(),
      value: z.string(),
    }))

    const variables = await this.get('/variables')

    return VariablesSchema.parse(variables) as FetchedVars
  }
}

export {
  AbstractRepo,
  ApiRepo,
  FetchedLocations,
  FetchedVars
}
