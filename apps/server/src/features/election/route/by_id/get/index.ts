import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import { GetElectionByIdUseCase } from './use-case'
import middleware from './middleware'
import { Container } from '@n8n/di'

const GetElectionByIdRoute = new Hono().get('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const params = c.req.valid('param')
  const useCase = Container.get(GetElectionByIdUseCase)
  const result = await useCase.execute(params.electionId)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default GetElectionByIdRoute
