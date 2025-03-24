import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { z } from 'zod'
import { getApiUrl, getPort } from '#app/config'
import * as services from '#app/services/getLocationsByOrgId.js'
import * as repos from '#app/repositories/apiRepository'
import { ServerError, NotFoundError } from '#app/errors'
import { OrgId, RequestedVars } from '#app/types'
const app = express()
app.set('query parser', 'simple')
app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/api/locations/:orgId', async (req, res) => {
  try {
    const OrgIdSchema = z.number()
    const orgId = OrgIdSchema.parse(Number(req.params.orgId)) as OrgId
    const requestedVars = String(req.query.variables)
      .split(',')
      .filter(Boolean) as RequestedVars

    const locations = await services.getLocationsByOrgId({
      apiRepo: new repos.ApiRepo(),
      orgId,
      requestedVars,
    })

    res.status(200).send(locations)
  } catch (error) {
    if (error instanceof ServerError) {
      res.status(500).send('Internal server error')
    } else if (error instanceof NotFoundError) {
      res.status(404).send(error.message)
    } else {
      console.error(error)
      res.status(500).send('Internal server error')
    }
  }
})

app.get('/health', (_, res) => {
  res.status(200).send('OK')
})

app.listen(getPort(), () => {
  console.log(`Server listening at ${getApiUrl()}`)
})
