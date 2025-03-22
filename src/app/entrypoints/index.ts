import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { getApiUrl, getPort } from '#app/config'
import * as services from '#app/services/getLocationsByOrgId'
import * as repos from '#app/repositories/apiRepository'
const app = express()
app.set('query parser', 'simple')
app.use(bodyParser.json())
app.use(morgan('dev'))

// Configure query parser to always return strings

app.get('/api/locations/:orgId', async (req, res) => {
  const { orgId } = req.params
  const variables = String(req.query.variables).split(',').filter(Boolean)
  // schema validation on query params and orgId

  const locations = await services.getLocationsByOrgId({
    apiRepo: new repos.ApiRepo(),
    orgId,
    variables
  })

  res.status(200).send(locations)
})

app.get('/health', (_, res) => {
  res.status(200).send('OK')
})

app.listen(getPort(), () => {
  console.log(`Server listening at ${getApiUrl()}`)
})
