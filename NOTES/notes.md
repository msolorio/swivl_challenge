## Strategy
- Describe in words high level what we are trying to accomplish.

### Identify what aspects of the project are important.  
  - handling data fetching
    - retries
      - exponential backoff to avoid overwhelming the external API
    - timeouts
      - handling API requests that take too long to respond
      - timeout strategy to avoid blocking server for too long while waiting for a response.
    - Circuit breaker
      - used to prevent an application from repeatedly trying to connect to a failing service
      - After certain number of failures, cicruit is open / stops making requests
      - returns cached data until service is back up.
    - Caching
      - use caching where possible to reduce server and API load
    - Clear error messaging

### high level task
We want to fetch the requested variables for each location listed in the location endpoint.

GET /api/locations/<orgId>?variables=PhoneNumber,BrandName

1.
Psuedocode
- get locations list
- get variables list

2.
initialize hash map
- for org variables - o(q) where q is number of query params

```ts
orgVariables = {
  PhoneNumber: null,
  BrandName: null
}
```

- for locations - o(l) where l is # of locations
  - iterate through each location
  - if orgId matches route param
    - create new key for locationId with variables

```ts
locations = {
  "1": {
    PhoneNumber: null,
    BrandName: null,
  },
  "2": {
    PhoneNumber: null,
    BrandName: null,
  },
  "3": {
    PhoneNumber: null,
    BrandName: null,
  }
}
```

3.
iterate through variables list and populate results list
- o(v) where v is the # of variables

- if orgId not matches route param or key not matches query param
  - continue to next iteration

- if locationId is null
  - add as org level variable
- if locatonId is not null
  - index locations list
  - add value for variable

4.
Generate result list
- o(l) where l is the number of locations
- iterate through locations hashmap
- populate variable value
  - value from location hashmap | value from orgVariable hashmap
