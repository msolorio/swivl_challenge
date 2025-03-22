I have a few questions about requirements. I can make decisions on all of these and would be happy to, but wanted to check with the team if there are specific constraints.

I noticed that we are making a POST request to retrieve data at `/api/locations/{:orgId:}`. I think making a GET request with query parameters could allow for more efficient caching by a browser, and would more closely follow RESTful endpoint conventions. Could this be a better option?

- Is authorization required to access the API, or is it publicly accessible?
- What should be the response if an invalid orgId is provided?
- If external APIs fail or can't be reached what is the expected behavior?

Scale questions
- Do we know the expected requests per second to the service we are building?
- How many locations and variables can expect to have?
- Do we have any SLAs for response time?

assumptions
- if requested variables are not found for some locations but are found for others, return variables for the locations that have them and return null for the missing data. Instead of failing the entire request

- in data from variables endpiont, if we a locations that exists in multiple orgs, we will only pick the location returned from the locations endpoint.
