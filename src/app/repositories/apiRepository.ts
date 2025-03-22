interface AbstractRepo {
  getLocations: () => Promise<unknown>
  getVariables: () => Promise<unknown>
}

// emplement retries and exponential backoff
class ApiRepo implements AbstractRepo {
  private apiBaseUrl: string

  constructor() {
    this.apiBaseUrl = 'https://swivl-interview-e61c73ef3cf5.herokuapp.com';
  }

  async getLocations() {
    const response = await fetch(`${this.apiBaseUrl}/api/locations`)

    if (!response.ok) {
      throw new Error('Failed to fetch locations')
    }

    // possibly schema validation on response

    return await response.json()
  }

  async getVariables() {
    const response = await fetch(`${this.apiBaseUrl}/api/variables`)

    if (!response.ok) {
      throw new Error('Failed to fetch variables')
    }

    // possibly schema validation on response

    return await response.json()
  }
}

export {
  AbstractRepo,
  ApiRepo
}
